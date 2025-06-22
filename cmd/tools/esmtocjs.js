commands.add({
    name: ["esmtocjs"],
    command: ["esmtocjs"],
    alias: ["esm-cjs"],
    category: "tools",
    desc: "mengubah code/function esm menjadi cjs",
    run: async ({ sius, m, args, Func, dl }) => {
        let text = args.join(" ")
        let input = text || m.quoted?.text || m.quoted?.body || ''
        if (!input) return m.reply("[×] Sertakan/reply code tipe esm yang ingin diubah menjadi bentuk cjs")
        try {
            let convertedCode = await ESMtoCJS(input)
            await m.reply(`${convertedCode}`)
        } catch (error) {
            sius.cantLoad(error)
        }
    }
})
 
async function ESMtoCJS(code) {
  let result = code;
  result = result.replace(/import\s+(\w+)\s+from\s+['"`]([^'"`]+)['"`];?/g, 'const $1 = require(\'$2\');');
  result = result.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+['"`]([^'"`]+)['"`];?/g, (match, namedImports, modulePath) => {
    const imports = namedImports.split(',').map(imp => {
      const trimmed = imp.trim();
      if (trimmed.includes(' as ')) {
        const [original, alias] = trimmed.split(' as ').map(s => s.trim());
        return `${alias}: ${original}`;
      }
      return trimmed;
    }).join(', ');
    return `const { ${imports} } = require('${modulePath}');`;
  });
  result = result.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"`]([^'"`]+)['"`];?/g, 'const $1 = require(\'$2\');');
  result = result.replace(/import\s+(\w+)\s*,\s*\{\s*([^}]+)\s*\}\s+from\s+['"`]([^'"`]+)['"`];?/g, (match, defaultImport, namedImports, modulePath) => {
    const imports = namedImports.split(',').map(imp => {
      const trimmed = imp.trim();
      if (trimmed.includes(' as ')) {
        const [original, alias] = trimmed.split(' as ').map(s => s.trim());
        return `${alias}: ${original}`;
      }
      return trimmed;
    }).join(', ');
    return `const ${defaultImport} = require('${modulePath}');\nconst { ${imports} } = require('${modulePath}');`;
  });
  result = result.replace(/import\s+['"`]([^'"`]+)['"`];?/g, 'require(\'$1\');');
  result = result.replace(/export\s+default\s+(.*)/g, 'module.exports = $1');
  result = result.replace(/export\s+((?:const|let|var|function|class|async\s+function)\s+\w+.*)/g, (match, declaration) => {
    const nameMatch = declaration.match(/(?:const|let|var|function|class|async\s+function)\s+(\w+)/);
    const name = nameMatch ? nameMatch[1] : '';
    return `${declaration}\nmodule.exports.${name} = ${name};`;
  });
  result = result.replace(/export\s+\{\s*([^}]+)\s*\}/g, (match, exports) => {
    const exportList = exports.split(',').map(exp => {
      const trimmed = exp.trim();
      if (trimmed.includes(' as ')) {
        const [original, alias] = trimmed.split(' as ').map(s => s.trim());
        return `module.exports.${alias} = ${original};`;
      }
      return `module.exports.${trimmed} = ${trimmed};`;
    }).join('\n');
    return exportList;
  });
  result = result.replace(/export\s+\{\s*([^}]+)\s*\}\s+from\s+['"`]([^'"`]+)['"`];?/g, (match, exports, modulePath) => {
    const exportList = exports.split(',').map(exp => {
      const trimmed = exp.trim();
      if (trimmed.includes(' as ')) {
        const [original, alias] = trimmed.split(' as ').map(s => s.trim());
        return `module.exports.${alias} = require('${modulePath}').${original};`;
      }
      return `module.exports.${trimmed} = require('${modulePath}').${trimmed};`;
    }).join('\n');
    return exportList;
  });
  result = result.replace(/export\s+\*\s+from\s+['"`]([^'"`]+)['"`];?/g, 'Object.assign(module.exports, require(\'$1\'));');
  result = result.replace(/export\s+\*\s+as\s+(\w+)\s+from\s+['"`]([^'"`]+)['"`];?/g, 'module.exports.$1 = require(\'$2\');');
  result = result.replace(/import\s*\s*['"`]([^'"`]+)['"`]\s*/g, 'Promise.resolve(require(\'$1\'))');
  result = result.replace(/import\.meta\.url/g, '__filename');
  return result.trim();
}
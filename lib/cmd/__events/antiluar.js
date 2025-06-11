export default {
    name: "anti_nomorluar",
    exec: async ({ sius, m, Func }) => {
        const blockedCodes = ["93", "212", "91", "92", "90", "54", "55", "95", "94", "256"]
        if (blockedCodes.some(code => m.sender.startsWith(code))) {
            sius.updateBlockStatus(m.sender, "block")
            return true;
        }
        return false;
    }
}
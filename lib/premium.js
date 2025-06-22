import toMs from "ms";

/**
 * Add premium user.
 * @param {String} userId
 * @param {String} expired
 * @param {Object} _dir
 */
const addPremiumUser = (userId, expired, _dir) => {
    const cekUser = _dir.find((user) => user.id == userId);
    if (cekUser) {
        cekUser.expired = cekUser.expired + toMs(expired);
    } else {
        const obj = { id: userId, expired: Date.now() + toMs(expired) };
        _dir.push(obj);
    }
};

/**
 * Get premium user position.
 * @param {String} userId
 * @param {Object} _dir
 * @returns {Number}
 */
const getPremiumPosition = (userId, _dir) => {
    let position = null;
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i;
        }
    });
    if (position !== null) {
        return position;
    }
};

/**
 * Get premium user expire.
 * @param {String} userId
 * @param {Object} _dir
 * @returns {Number}
 */
const getPremiumExpired = (userId, _dir) => {
    let position = null;
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i;
        }
    });
    if (position !== null) {
        return _dir[position].expired;
    }
};

/**
 * Check user is premium.
 * @param {String} userId
 * @param {Object} _dir
 * @returns {Boolean}
 */
const checkPremiumUser = (userId, _dir) => {
    let status = false;
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            status = true;
        }
    });
    return status;
};

/**
 * Constantly checking premium.
 * @param {Object} conn
 * @param {Object} _dir
 */
const expiredCheck = (conn, _dir) => {
    setInterval(() => {
        let position = null;
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].expired) {
                position = i;
            }
        });
        if (position !== null) {
            const idny = _dir[position].id;
            console.log(`Premium expired: ${_dir[position].id}`);
            _dir.splice(position, 1);
            if (idny) {
                conn.sendMessage(idny, { text: "Premium Expired, terima kasih sudah menjadi pengguna premium kami!" });
            }
        }
    }, 1000);
};

/**
 * Get all premium user ID.
 * @param {Object} _dir
 * @returns {String[]}
 */
const getAllPremiumUser = (_dir) => {
    const array = [];
    Object.keys(_dir).forEach((i) => {
        array.push(_dir[i].id);
    });
    return array;
};

export {
    addPremiumUser,
    getPremiumExpired,
    getPremiumPosition,
    expiredCheck,
    checkPremiumUser,
    getAllPremiumUser,
};
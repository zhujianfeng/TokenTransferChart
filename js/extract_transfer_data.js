function extractAccountData(ele) {
    const href = ele.href;
    const spanEle = ele.querySelector('span');
    let accountType = CONSTANT.AccountTypeUser;
    let nickName = spanEle.innerHTML;
    const nickNameRegMatch = /^0x[a-fA-F0-9]{40}$/.exec(nickName);
    if (nickNameRegMatch !== null) {
        nickName = nickName.substr(2, 6);
    } else {
        accountType = CONSTANT.AccountTypeSwap;
    }

    let address = spanEle.getAttribute('data-original-title');
    const addressRegMatch = /^0x[a-fA-F0-9]{40}$/.exec(address);
    if (addressRegMatch === null) {
        const addressSubstrRegMatch = /^.*\((0x[a-fA-F0-9]{40})\)$/.exec(address);
        if (addressSubstrRegMatch !== null && addressSubstrRegMatch.length > 1) {
            address = addressSubstrRegMatch[1];
        }
    }

    return {
        href: href,
        nickName: nickName,
        address: address,
        type: accountType
    }
}

function extractValue(ele) {
    const value = {
        number: '',
        usd: ''
    };
    const valStr = ele.innerHTML.replaceAll(',','').trim();
    const regMatch = /^[0-9]+[\.]{0,1}[0-9]*$/.exec(valStr);
    if (regMatch !== null) {
        value.number = new Number(valStr).toPrecision(6);
    }
    const usdRegMatch = /^([0-9]+[\.]{0,1}[0-9]*) *\((.*)\)$/.exec(valStr);
    if (usdRegMatch !== null && usdRegMatch.length > 2) {
        value.number = new Number(usdRegMatch[1]).toPrecision(6);
        value.usd = usdRegMatch[2];
    }
    return value;
}

function extractToken(ele) {
    const tokenChildSpan = ele.querySelector('span');
    let tokenStr = '';
    if (!tokenChildSpan) {
        tokenStr = ele.innerHTML;
    }
    tokenStr = ele.lastChild.textContent;

    if (tokenStr.trim() === ')') {
        tokenStr = ele.lastChild.previousSibling.getAttribute('data-original-title');
    }

    const regMatch = /.*\((.+)\).*/.exec(tokenStr);
    if (regMatch && regMatch.length > 1) {
        return regMatch[1];
    } else {
        return tokenStr;
    }
}

function extractRecordData(ele) {
    const accounts = ele.querySelectorAll('span.hash-tag > a');
    const fromAccount = extractAccountData(accounts[0]);
    const toAccount = extractAccountData(accounts[1]);

    let valueEle = ele.querySelector('span.mr-1 > span');
    if (!valueEle) {
        const spans = ele.querySelectorAll('span.mr-1');
        valueEle = spans[spans.length - 1];
    }
    const value = extractValue(valueEle);

    const token = extractToken(ele.lastChild);

    return {
        'from': fromAccount,
        'to': toAccount,
        'value': value,
        'token': token
    }
}

function extractTransferredRecords() {
    const wrapper = getWrapper();
    if (wrapper === null) {
        return null;
    }
    const list = wrapper.querySelectorAll('li>.media-body');
    const listData = [];
    list.forEach((ele) => {
        listData.push(extractRecordData(ele));
    });
    return listData;
}
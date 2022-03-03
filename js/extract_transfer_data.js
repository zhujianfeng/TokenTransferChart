function extractAccountData(ele) {
    const href = ele.href;
    const spanEle = ele.querySelector('span');
    const nickName = spanEle.innerHTML;
    const address = spanEle.getAttribute('data-original-title');
    return {
        "href": href,
        "nickName": nickName,
        "address": address
    }
}

function extractValue(ele) {
    const number = ele.innerHTML;
    return {
        "number": number
    }
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
        "from": fromAccount,
        "to": toAccount,
        "value": value,
        "token": token
    }
}

function extractTransferredRecords() {
    const wrapper = document.getElementById('wrapperContent');
    const list = wrapper.querySelectorAll('li>.media-body');
    const listData = [];
    list.forEach((ele) => {
        listData.push(extractRecordData(ele));
    });
    console.log(listData);
}
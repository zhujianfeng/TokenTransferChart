window.addEventListener('load', () => {
    const transferredRecords = extractTransferredRecords();
    
    if (transferredRecords === null) {
        console.log('未获取到交易转账记录');
        return;
    }
    drawGraph(transferredRecords);

});
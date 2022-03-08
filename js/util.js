function getWrapper() {
    // 某个页面写的不标准，出现两个ID为wrapperContent的元素，不能直接getElementById
    const wrappList = document.querySelectorAll('#wrapperContent');
    if (wrappList.length <= 0) {
        return null;
    }
    return wrappList[wrappList.length - 1];
}
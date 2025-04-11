import ReactDOM from "react-dom";

/**
 * 将react虚拟节点插入真实的domId中
 * @param node 插入node
 * @param reactDom  reactDOM
 */
export function render(
    node: Element,
    reactDom: any,
    childNodeId = `ext_id_${Math.floor(Math.random() * 99999)}`,
) {
    const childNode = document.createElement("div");
    childNode.setAttribute("id", childNodeId);
    ReactDOM.render(reactDom, childNode);
    node?.appendChild(childNode);
    return childNodeId;
}

/**
 * 删除dom
 * @param dom id
 */
export function delReactDom(dom: string | Element, domType = "id") {
    let node;
    if (domType === "id") {
        node = document.getElementById(dom as string);
    } else {
        node = dom as Element;
    }
    if (node) ReactDOM.unmountComponentAtNode(node);
    if (node) node.parentElement?.removeChild(node);
}

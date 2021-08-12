import ReactTooltip from 'react-tooltip' //https://wwayne.github.io/react-tooltip/

function ExpandTooltip(p) {

	return <><span data-tip data-tip-disable={p.tooltip?.length===0} data-for={p.id}>{p.children}</span><ReactTooltip id={p.id} className="xTooltip" overridePosition={ (
    { left, top },
    currentEvent, currentTarget, node) => {
  const d = document.documentElement;
  left = Math.min(d.clientWidth - node.clientWidth, left);
  top = Math.min(d.clientHeight - node.clientHeight, top);
  left = Math.max(0, left);
  top = Math.max(0, top);
  return { top, left }
} }>{p.tooltip}</ReactTooltip></>
}

export {ExpandTooltip}
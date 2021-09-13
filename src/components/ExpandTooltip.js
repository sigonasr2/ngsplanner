import { UncontrolledTooltip } from "reactstrap"

function ExpandTooltip(p) {

	return <UncontrolledTooltip className="xTooltip" fade={true} placement="bottom" {...p}>
      {p.children}
    </UncontrolledTooltip>
}

export {ExpandTooltip}
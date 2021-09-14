
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";

function Class(p) {
    const CLASSES = p.GetData("class",undefined,undefined,p.useIDs??false)
      const class_obj = CLASSES[p.name]
      return <ReactPlaceholder style={{height:8}} showLoadingAnimation ready={CLASSES!=="no data"} type="textRow" rows={1}>{class_obj?<><img alt="" src={process.env.PUBLIC_URL+class_obj.icon}/>{!p.hideName&&class_obj.name}</>:<></>}</ReactPlaceholder>
  }

export default Class;
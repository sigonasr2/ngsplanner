
import ReactPlaceholder from 'react-placeholder';
import { MediaBlock,TextRow } from 'react-placeholder/lib/placeholders';
import "react-placeholder/lib/reactPlaceholder.css";

const CustomPlaceholder = (
    <div>
        <MediaBlock color="rgba(255,255,255)" style={{}}/>
        <TextRow color="rgba(255,255,255)" style={{width:240,position:"relative",height:100}} rows={3}/>
    </div>
)

function LoginPlaceholder(p) {
    return <ReactPlaceholder customPlaceholder={CustomPlaceholder} showLoadingAnimation {...p}>
        {p.children}
        </ReactPlaceholder>
}

export default LoginPlaceholder;
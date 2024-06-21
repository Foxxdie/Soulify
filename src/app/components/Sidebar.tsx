import ChatWithSoul from './chat/ChatWIthSoul'
import Blueprint from './blueprint/Blueprint'
import Collapsible from './misc/Collapsible'


export default function Sidebar() {

  return (
    <div className="w-[400px] h-screen bg-white flex flex-col">
      <Collapsible title="Soul Options">
        <Blueprint />
      </Collapsible>
      <Collapsible title="Soul Chat" defaultOpen={true} >
        <ChatWithSoul />
      </Collapsible>
      
    </div>
  )
}

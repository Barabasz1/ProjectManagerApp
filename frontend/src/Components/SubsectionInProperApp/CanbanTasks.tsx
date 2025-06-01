import React from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Components/ui/resizable"
const CanbanTasks = () => {
  return (
    
<ResizablePanelGroup direction="horizontal" >
      <ResizablePanel>
        ONE
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>Two</ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>three</ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>four</ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>five</ResizablePanel>

    </ResizablePanelGroup>
    
  
    
    
  )
}

export default CanbanTasks
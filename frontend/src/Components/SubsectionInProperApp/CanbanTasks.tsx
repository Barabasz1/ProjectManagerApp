import React from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Components/ui/resizable"
const CanbanTasks = () => {
  return (
    <div className="w-full h-full">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="w-full min-w-full mx-0 overflow-x-hidden"
      >
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
    </div>
  )
}

export default CanbanTasks
import React from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Components/ui/resizable"
import HeaderCanban from '../Basic/HeaderCanban'
import TaskElement from '../Basic/TaskElement'
import { ScrollArea } from "@/Components/ui/scroll-area"

const CanbanTasks = () => {
  return (
    <>
  
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <HeaderCanban text={"1 - to do"} index={0}/>
        <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
            <TaskElement/>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <HeaderCanban text={"2 - designing"} index={1}/>
          <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'>
            <TaskElement/>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <HeaderCanban text={"3 - coding"} index={2}/>
          <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'></div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <HeaderCanban text={"4 - in test"} index={3}/>
          <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'></div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <HeaderCanban text={"5 - finished"} index={4}/>
          <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'></div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
    <button 
        className="fixed text-5xl bottom-10 right-10 w-20 h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center z-20 transition-all duration-400 transform hover:scale-110"
        onClick={() => console.log('Add new team')}
      >
        <span className="font-semibold leading-none flex items-center justify-center pb-2" >+</span>
      </button>

</>
  )
}

export default CanbanTasks
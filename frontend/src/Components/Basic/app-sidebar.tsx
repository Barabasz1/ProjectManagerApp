import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "#",
  },
  {
    title: "Inbox",
    url: "#",
    
  },
  {
    title: "Calendar",
    url: "#",
   
  },
  {
    title: "Search",
    url: "#",
    
  },
  {
    title: "Settings",
    url: "#",
   
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarContent>
        <SidebarHeader>Projects:</SidebarHeader>
       
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex justify-between items-center w-full pr-3">
  <span>{item.title}</span>
  <button onClick={()=>{console.log("click")}} className="bg-red-600  border-red-800 border-8 hover:bg-red-400 hover:border-red-400 hover:cursor-pointer  text-white rounded-full w-7 h-7 flex items-center justify-center text-xl ">X</button>
</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
        
      </SidebarContent>
      <SidebarFooter>
        <p>footer</p>
      </SidebarFooter>
    </Sidebar>
  )
}
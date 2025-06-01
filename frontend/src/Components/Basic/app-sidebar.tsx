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
                    <a href={item.url}>
                     
                      <span>{item.title}</span>
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
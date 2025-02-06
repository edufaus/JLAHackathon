<script lang="ts">
// import icons lucide
import { Book, Video, MessageSquare,NotebookPen } from "lucide-svelte";
import Button from "../ui/button/button.svelte";
</script>

<div
class="flex flex-col items-center space-y-2 
       rounded-lg border border-[#db4a2b]/30 
       bg-black/10 backdrop-blur 
       hover:border-[#db4a2b]/90 
       transition-all duration-300
       p-3 shadow-md"
>
<!-- Book Button -->
<Button 
  class="bg-transparent hover:bg-transparent text-white transition-all duration-300 transform hover:scale-[1.2] hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4"
>
  <Book class="w-8 h-8" />
</Button>

<!-- Video Button -->
<a href="/study/video" class="text-white transition-all duration-300 transform hover:scale-[1.2] hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4">
<Button 
  class="bg-transparent hover:bg-transparent text-white transition-all duration-300 transform hover:scale-[1.2] hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4"
>
  <Video class="w-8 h-8" />
</Button>
</a>
<!-- Message Button -->
<Button 
  class="bg-transparent hover:bg-transparent text-white transition-all duration-300 transform hover:scale-[1.2] hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4"
>
  <MessageSquare class="w-8 h-8" />
</Button>

<a href="/study/docs/dashboard" class="text-white transition-all duration-300 transform hover:scale-[1.2] hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4">
  <Button 
    class="bg-transparent hover:bg-transparent text-white transition-all duration-300 transform hover:scale-[1.2] hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4"
  >
    <NotebookPen class="w-8 h-8" />
  </Button>
</a>
</div>
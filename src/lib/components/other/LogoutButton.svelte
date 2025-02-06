<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { auth } from "$lib/firestuff.js"; // Adjust the path as necessary
    import { goto } from "$app/navigation";

    async function handleLogout() {
        alert("logout")
        console.log("efsdf")
      
    }
</script>


   <Button
                class="login-element w-full bg-[#8B5CF6] hover:bg-[#7733ff] transform hover:scale-105 transition-all duration-300"
                onclick={handleLogout}
            >
                LogOut 
            </Button>
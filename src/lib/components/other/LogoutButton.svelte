<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { auth } from "$lib/firestuff.js"; // Adjust the path as necessary
    import { goto } from "$app/navigation";

    async function handleLogout() {
alert("logout")
        try {
            await auth.signOut();
            goto('/auth/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
</script>

dsafd
<Button 
    variant="outline" 
    class="text-gray-300 bg-black/20 border-gray-500 hover:bg-black/40 hover:text-gray-300 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]" 
    onclick={handleLogout}
>
    Logout
</Button>
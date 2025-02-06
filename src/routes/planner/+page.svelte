<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { onMount } from "svelte";
    import { db, auth } from '$lib/firestuff.js';
    import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, deleteDoc } from 'firebase/firestore';

    let user: any;
    let todos: any[] = [];
    let announcements: any[] = [];

    // Add this new function to load announcements
    async function loadAnnouncements() {
        try {
            const announcementsRef = collection(db, "Announcements");
            const q = query(announcementsRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            
            announcements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error loading announcements:", error);
        }
    }

    async function loadTodos(userId: string) {
        try {
            console.log('Loading todos for user:', userId);
            const todosRef = collection(db, "Todos", userId, "items");
            const q = query(todosRef, orderBy("date", "asc"));
            const querySnapshot = await getDocs(q);
            
            console.log('Todos snapshot size:', querySnapshot.size);
            todos = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(todo => !todo.deleted);
            console.log('Processed todos:', todos);
        } catch (error) {
            console.error("Error loading todos:", error);
        }
    }

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (usr) => { 
            console.log('Auth state changed:', usr ? 'User logged in' : 'No user');
            if (usr) {
                try {
                    const docRef = doc(db, "Users", usr.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        user = docSnap.data();
                        user.uid = usr.uid;
                        await loadTodos(usr.uid);
                        await loadAnnouncements(); // Add this line
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                }
            } else {
                console.log('Redirecting to login');
                location.href = "/auth/login";
            }
        });

        return () => {
            console.log('Component unmounting');
            unsubscribe();
        };
    });

    async function toggleTodo(todoId: string, completed: boolean) {
        try {
            console.log('Toggling todo:', todoId, 'to completed:', completed);
            if (!user || !user.uid) {
                console.error('No user or user.uid found:', user);
                return;
            }
    
            const todoRef = doc(db, "Todos", user.uid, "items", todoId);
            await setDoc(todoRef, { completed }, { merge: true });
            console.log('Todo toggle saved successfully');
            
            await loadTodos(user.uid);
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    }

    async function deleteTodo(todoId: string) {
        try {
            console.log('Deleting todo:', todoId);
            if (!user || !user.uid) {
                console.error('No user or user.uid found:', user);
                return;
            }
    
            const todoRef = doc(db, "Todos", user.uid, "items", todoId);
            await deleteDoc(todoRef);
            console.log('Todo deleted successfully');
            
            await loadTodos(user.uid);
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    }

    let newTodoTitle = "";
    let newTodoDescription = "";
    let newTodoDate = "";

    async function createTodo() {
        try {
            if (!user || !user.uid || !newTodoTitle || !newTodoDate) {
                console.error('Missing required fields');
                return;
            }

            const todoData = {
                title: newTodoTitle,
                description: newTodoDescription,
                date: newTodoDate,
                completed: false,
                deleted: false,
                timestamp: new Date().toISOString()
            };

            const todosRef = collection(db, "Todos", user.uid, "items");
            await setDoc(doc(todosRef), todoData);

            // Reset form
            newTodoTitle = "";
            newTodoDescription = "";
            newTodoDate = "";

            // Reload todos
            await loadTodos(user.uid);
        } catch (error) {
            console.error("Error creating todo:", error);
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#110033] p-8">
    <div class="max-w-4xl mx-auto bg-black/20 border border-[#8B5CF6]/20 rounded-lg p-6 backdrop-blur-md">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#cc99ff] to-[#7733ff] bg-clip-text text-transparent">
                Daily Planner
            </h1>
            <Button
                class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]"
                onclick={() => window.location.href = '/dashboard'}
            >
                Back to Dashboard
            </Button>
        </div>

        <!-- Add this new section -->
        <div class="mb-8">
            <h2 class="text-2xl font-bold text-white mb-4">School Announcements</h2>
            <div class="space-y-4">
                {#each announcements as announcement}
                    <div class="bg-black/30 p-4 rounded-lg border border-[#8B5CF6]/20">
                        <h3 class="text-white text-lg font-semibold">{announcement.title}</h3>
                        <p class="text-white/60 mt-2">{announcement.content}</p>
                        <div class="flex justify-between items-center mt-2">
                            <p class="text-[#8B5CF6] text-sm">{new Date(announcement.timestamp).toLocaleDateString()}</p>
                            <p class="text-white/40 text-sm">By {announcement.authorName}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- ... announcements section ... -->
        
        <div class="mt-8">
            <h2 class="text-2xl font-bold text-white mb-4">Your Tasks</h2>
            
            <!-- Add Todo Form -->
            <form class="mb-6 space-y-4" on:submit|preventDefault={createTodo}>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="text"
                        placeholder="Task title"
                        bind:value={newTodoTitle}
                        required
                        class="bg-black/30 border-[#8B5CF6]/20 text-white"
                    />
                    <Input
                        type="date"
                        bind:value={newTodoDate}
                        required
                        class="bg-black/30 border-[#8B5CF6]/20 text-white"
                    />
                </div>
                <Input
                    type="text"
                    placeholder="Description (optional)"
                    bind:value={newTodoDescription}
                    class="bg-black/30 border-[#8B5CF6]/20 text-white"
                />
                <Button type="submit" class="w-full bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]">
                    Add Task
                </Button>
            </form>

            <div class="space-y-4">
                {#each todos.filter(t => !t.deleted) as todo}
                    <div class="bg-black/30 p-4 rounded-lg border border-[#8B5CF6]/20">
                        <div class="flex justify-between items-start">
                            <div class="flex items-start space-x-3 flex-1">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    on:change={() => toggleTodo(todo.id, !todo.completed)}
                                    class="mt-1"
                                />
                                <div class="flex-1">
                                    <h3 class="text-white text-lg {todo.completed ? 'line-through opacity-50' : ''}">{todo.title}</h3>
                                    {#if todo.description}
                                        <p class="text-white/60 mt-1 {todo.completed ? 'line-through opacity-50' : ''}">{todo.description}</p>
                                    {/if}
                                    <p class="text-[#8B5CF6] text-sm mt-2">{todo.date}</p>
                                </div>
                            </div>
                            <button
                                class="text-red-500 hover:text-red-400 px-2"
                                on:click={() => deleteTodo(todo.id)}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
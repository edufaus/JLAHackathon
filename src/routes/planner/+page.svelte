<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { onMount } from "svelte";
    import { db, auth } from '$lib/firestuff.js';
    import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

    let user: any;
    let todos: any[] = [];
    let newTodo = {
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        completed: false
    };

    async function loadTodos(userId: string) {
        const todosRef = collection(db, "Todos", userId, "items");
        const q = query(todosRef, orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        
        todos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async function addTodo() {
        if (!newTodo.title) return;

        const todoId = crypto.randomUUID();
        const todoRef = doc(db, "Todos", user.uid, "items", todoId);
        
        await setDoc(todoRef, {
            ...newTodo,
            timestamp: new Date().toISOString()
        });

        await loadTodos(user.uid);
        newTodo.title = "";
        newTodo.description = "";
    }

    async function toggleTodo(todoId: string, completed: boolean) {
        const todoRef = doc(db, "Todos", user.uid, "items", todoId);
        await setDoc(todoRef, { completed }, { merge: true });
        await loadTodos(user.uid);
    }

    async function deleteTodo(todoId: string) {
        const todoRef = doc(db, "Todos", user.uid, "items", todoId);
        await setDoc(todoRef, { deleted: true }, { merge: true });
        await loadTodos(user.uid);
    }

    onMount(() => {
        auth.onAuthStateChanged(async (usr) => { 
            if (usr) {
                try {
                    const docRef = doc(db, "Users", usr.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        user = docSnap.data();
                        await loadTodos(usr.uid);
                    } else {
                        if (!location.href.includes("/auth/createAccount")) {
                            location.href = "/auth/createAccount";
                        }
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                }
            } else {
                if (!["/signup", "/login"].includes(location.pathname)) {
                    location.href = "/";
                }
            }
        });
    });
</script>

<div class="min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#110033] p-8">
    <div class="max-w-4xl mx-auto bg-black/20 border border-[#8B5CF6]/20 rounded-lg p-6 backdrop-blur-md">
        <h1 class="text-4xl font-bold mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#cc99ff] to-[#7733ff] bg-clip-text text-transparent">
            Daily Planner
        </h1>

        <div class="mb-8">
            <h2 class="text-white text-xl mb-4">Add New Task</h2>
            <div class="space-y-4">
                <Input
                    type="text"
                    placeholder="Task title"
                    class="w-full bg-black/30 text-white border-[#8B5CF6]/20"
                    bind:value={newTodo.title}
                />
                <textarea
                    placeholder="Task description"
                    class="w-full p-2 rounded-lg bg-black/30 text-white border border-[#8B5CF6]/20 focus:border-[#7733ff] transition-all"
                    rows="2"
                    bind:value={newTodo.description}
                ></textarea>
                <Input
                    type="date"
                    class="w-full bg-black/30 text-white border-[#8B5CF6]/20"
                    bind:value={newTodo.date}
                />
                <Button 
                    class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb] w-full"
                    on:click={addTodo}
                >
                    Add Task
                </Button>
            </div>
        </div>

        <div class="mt-8">
            <h2 class="text-2xl font-bold text-white mb-4">Your Tasks</h2>
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
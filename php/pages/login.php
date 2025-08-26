<div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to C BOE
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Cryptocurrency Investment Platform
            </p>
        </div>
        <form class="mt-8 space-y-6" id="loginForm">
            <div class="rounded-md shadow-sm -space-y-px">
                <div>
                    <label for="username" class="sr-only">Username</label>
                    <input id="username" name="username" type="text" required 
                           class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                           placeholder="Username">
                </div>
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input id="password" name="password" type="password" required 
                           class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                           placeholder="Password">
                </div>
            </div>

            <div>
                <button type="submit" 
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign in
                </button>
            </div>

            <div class="text-center">
                <a href="?page=register" class="text-blue-600 hover:text-blue-500">
                    Don't have an account? Register here
                </a>
            </div>
        </form>

        <div id="message" class="hidden mt-4 p-4 rounded-md"></div>
    </div>
</div>

<script>
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const response = await fetch('/php/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'mt-4 p-4 rounded-md bg-green-100 text-green-700';
            messageDiv.textContent = 'Login successful! Redirecting...';
            messageDiv.classList.remove('hidden');
            
            setTimeout(() => {
                window.location.href = '?page=dashboard';
            }, 1000);
        } else {
            messageDiv.className = 'mt-4 p-4 rounded-md bg-red-100 text-red-700';
            messageDiv.textContent = data.error || 'Login failed';
            messageDiv.classList.remove('hidden');
        }
    } catch (error) {
        messageDiv.className = 'mt-4 p-4 rounded-md bg-red-100 text-red-700';
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.classList.remove('hidden');
    }
});
</script>
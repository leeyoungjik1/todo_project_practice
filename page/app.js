const BASE_URL = '127.0.0.1:5000'
async function login(email, password){
    const userJSON = await fetch(`http://${BASE_URL}/api/users/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email, password
        })
    })
    const user = await userJSON.json()
    return user
}
async function getGroups(field, token){
    const groupJSON = await fetch(`http://${BASE_URL}/api/todos/group/mine/${field}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    const group = await groupJSON.json()
    return group.docs
}
async function fetchData(){
    const user = await login('cmzwmuf@gmail.com', 'ojelubmqvy')
    let group = await getGroups('category', user.token)
    return group
}
fetchData()
.then(group => {
    console.log(group)
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'line',
        data: {
        labels: group.map(item => item._id),
        datasets: [{
            label: '# of Todos',
            data: group.map(item => item.count),
            borderWidth: 1,
            backgroundColor: '#FFD700',
            borderColor: '#FFD700',
        }]
        },
        options: {
        scales: {
            y: {
            beginAtZero: true
            }
        },
        plugins: {
            colors: {
            enabled: true
            }
        }
        }
    });
})
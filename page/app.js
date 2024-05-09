// const BASE_URL = '127.0.0.1:5000'
// async function login(email, password){
//     const userJSON = await fetch(`http://${BASE_URL}/api/users/login`, {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             email, password
//         })
//     })
//     const user = await userJSON.json()
//     return user
// }
// async function getGroups(field, token){
//     const groupJSON = await fetch(`http://${BASE_URL}/api/todos/group/${field}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     })
//     const group = await groupJSON.json()
//     return group.docs
// }
// async function fetchData(){
//     const user = await login('sun@gmail.com', '1234567890')
//     let group = await getGroups('category', user.token)
//     return group
// }
// fetchData()
// .then(group => {
//     console.log(group)
//     const ctx = document.getElementById('myChart');
//     new Chart(ctx, {
//         type: 'line',
//         data: {
//         labels: group.map(item => item._id),
//         datasets: [{
//             label: '# of Todos',
//             data: group.map(item => item.count),
//             borderWidth: 1,
//             backgroundColor: '#FFD700',
//             borderColor: '#FFD700',
//         }]
//         },
//         options: {
//         scales: {
//             y: {
//             beginAtZero: true
//             }
//         },
//         plugins: {
//             colors: {
//             enabled: true
//             }
//         }
//         }
//     });
// })





const BASE_URL = 'http://127.0.0.1:5000'
const email = 'sun@gmail.com'
const password = '1234567890a!'
const confirmPassword = '1234567890a!'
const graphType = 'bar'
const field = 'category'

async function login(email, password){
    const userJSON = await fetch(`${BASE_URL}/api/users/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email, password, confirmPassword
        })
    })
    const user = await userJSON.json()
    return user
}
async function getGroups(field, user){
    console.log(user)
    let base_url = `${BASE_URL}/api/todos/group`
    if(!user.isAdmin){
        base_url += '/mine'
    }
    if(field === 'createdAt'  || field === 'lastModifiedAt' || field === 'finishedAt'){
        base_url += '/date'
    }
    const groupJSON = await fetch(`${base_url}/${field}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    })
    const group = await groupJSON.json()
    return group.docs
}
async function fetchData(email, password, field){
    const user = await login(email, password)
    const group = await getGroups(field, user)
    return group
}
function displayChart(type, group){
    // 차트 그리기
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type,
        data: {
        labels: group.filter(item => item._id !== null && item._id !== undefined && item._id !== '').map(item => item._id.year ? `${item._id.year}년 ${item._id.month}월` 
                            : typeof item._id === 'boolean' ? (item._id === true ? "종료": "진행중") 
                            : item._id),
        datasets: [{
            label: '# of Todos',
            data: group.filter(item => item._id !== null && item._id !== undefined && item._id !== '').map(item => item.count),
            borderWidth: 1,
            backgroundColor: '#FFD700',
            borderColor: '#FFD700',
        }]
        },
        options: {
            indexAxis: 'y',
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
}

fetchData(email, password, field)
.then(group => {
    console.log(group)
    displayChart(graphType, group)
})
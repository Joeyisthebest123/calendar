import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyD4wdFECWRmtSvRjzSlTEB_66cztCwdX34",
  authDomain: "evil-website-1cfeb.firebaseapp.com",
  databaseURL: "https://evil-website-1cfeb-default-rtdb.firebaseio.com",
  projectId: "evil-website-1cfeb",
  storageBucket: "evil-website-1cfeb.firebasestorage.app",
  messagingSenderId: "954756283974",
  appId: "1:954756283974:web:a5da5a10812de93ef71447"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


const julyScreen = document.getElementById("July");
const augustScreen = document.getElementById("August");
const namesDropdown = document.getElementById('names');

let serverSchedules = {
    "Joey": [], "Keegan": [], "Ella": [], "Julian": [], "Charlotte": [], "Abby": []
};

const schedulesRef = ref(db, 'schedules');
onValue(schedulesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        serverSchedules = data;
		updateSchedule()
        renderCalendar(); 
    }
});


const completeSchedule = new Array(62).fill(0);
function updateSchedule(){
	completeSchedule.fill(0);
	for(let name in serverSchedules){
		for(let i = 0; i <62; i++){
			if(serverSchedules[name][i] == 1){
				completeSchedule[i] = 1;
			}
		}
	}
}

function getActiveArray() {
	const page = window.location.pathname;
	if(page.includes("index.html") 	&& namesDropdown)
    return serverSchedules[namesDropdown.value];
	else
		return completeSchedule;
}

function renderCalendar() {
    const activeArray = getActiveArray();
    const activeMonthDiv = document.querySelector('.month.active');
    if (!activeMonthDiv) return;
    
    const monthId = activeMonthDiv.id; 
    const cells = activeMonthDiv.querySelectorAll('td');
    
    cells.forEach(cell => {
        if (cell.textContent.trim() === "") {
            cell.classList.remove('busy');
            return;
        }
        
        const day = parseInt(cell.textContent);
        let index = day - 1;
        if (monthId === 'August') {
            index += 31;
        }
        
        if (activeArray[index] === 1) {
            cell.classList.add('busy');
        } else {
            cell.classList.remove('busy');
        }
    });
}

if (namesDropdown) {
    namesDropdown.addEventListener('change', renderCalendar);
}


const calendarContainer = document.querySelector(".calendar");
if (calendarContainer) {
    calendarContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('next')) {
            julyScreen.classList.remove('active');
            augustScreen.classList.add('active');
            renderCalendar();
        }
        if (event.target.classList.contains('prev')) {
            augustScreen.classList.remove('active');
            julyScreen.classList.add('active');
            renderCalendar();
        }
    });
}

const calendars = document.querySelectorAll('.month');
calendars.forEach(calendar => {
    calendar.addEventListener('click', (event) => {		
		if (window.location.pathname.includes("schedule.html")) {
		            return; 
		}
				
        const clickedCell = event.target.closest('td');
        
        if (!clickedCell || clickedCell.textContent.trim() === "") {
            return;
        }
            
        const day = parseInt(clickedCell.textContent);
        const monthId = clickedCell.closest('.month').id;
        
        let index = day - 1;
        if (monthId === 'August') {
            index += 31;
        }
        
        const activeArray = getActiveArray();
        const selectedName = namesDropdown.value;
        
        activeArray[index] = (activeArray[index] === 1) ? 0 : 1;
        
        set(ref(db, `schedules/${selectedName}`), activeArray);
    });
});
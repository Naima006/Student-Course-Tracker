if (window.location.pathname.includes('form.html')) {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        const studentName = document.getElementById('studentName').value;
        const courseName = document.getElementById('courseName').value;
        const courseCode = document.getElementById('courseCode').value;
        const creditHours = document.getElementById('creditHours').value;
        const semester = document.getElementById('semester').value;

        const courseData = {
            studentName,
            courseName,
            courseCode,
            creditHours,
            semester
        };

        const existingData = JSON.parse(localStorage.getItem('courseData')) || [];
        existingData.push(courseData);
        localStorage.setItem('courseData', JSON.stringify(existingData));
        this.reset();
    });
}

if (window.location.pathname.includes('table.html')) {
    renderCourseTable();
}

function renderCourseTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear previous content

    let courseData = JSON.parse(localStorage.getItem('courseData')) || [];

    if (courseData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-gray-500 py-4">No course data available.</td>
            </tr>
        `;
        return;
    }

    courseData.forEach((course, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${course.studentName}</td>
            <td class="px-6 py-4 whitespace-nowrap">${course.courseName}</td>
            <td class="px-6 py-4 whitespace-nowrap">${course.courseCode}</td>
            <td class="px-6 py-4 whitespace-nowrap">${course.creditHours}</td>
            <td class="px-6 py-4 whitespace-nowrap">${course.semester}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button class="bg-yellow-400 text-white px-3 py-1 rounded mr-2 edit-btn" data-index="${index}">Edit</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            courseData.splice(index, 1);
            localStorage.setItem('courseData', JSON.stringify(courseData));
            renderCourseTable(); // refresh without reloading
        });
    });

    // Edit
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const row = e.target.closest('tr');
            const course = courseData[index];

            if (e.target.innerText === 'Edit') {
                row.children[0].innerHTML = `<input class="w-full border p-1" value="${course.studentName}">`;
                row.children[1].innerHTML = `<input class="w-full border p-1" value="${course.courseName}">`;
                row.children[2].innerHTML = `<input class="w-full border p-1" value="${course.courseCode}">`;
                row.children[3].innerHTML = `<input class="w-full border p-1" value="${course.creditHours}">`;
                row.children[4].innerHTML = `<input class="w-full border p-1" value="${course.semester}">`;

                e.target.innerText = 'Save';
                e.target.classList.remove('bg-yellow-400');
                e.target.classList.add('bg-green-500');
            } else {
                courseData[index] = {
                    studentName: row.children[0].querySelector('input').value,
                    courseName: row.children[1].querySelector('input').value,
                    courseCode: row.children[2].querySelector('input').value,
                    creditHours: row.children[3].querySelector('input').value,
                    semester: row.children[4].querySelector('input').value,
                };

                localStorage.setItem('courseData', JSON.stringify(courseData));
                renderCourseTable(); // refresh without reloading
            }
        });
    });
}

// Call on page load for table.html
if (window.location.pathname.includes('table.html')) {
    renderCourseTable();
}


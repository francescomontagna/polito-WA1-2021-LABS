'use strict';

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = new sqlite.Database('tasks.db', (err) => {
    if (err) throw(err);
});

function Task(id, description, isUrgent = false, isPrivate = false, deadline = '') {
    this.id = id;
    this.description = description;
    this.isUrgent = isUrgent;
    this.isPrivate = isPrivate;

    this.deadline = deadline && dayjs(deadline); // condition to format

    this.formatDeadline = (format) => {

        return this.deadline ? dayjs(deadline).format(format) : '<not defined>'
    }

    this.toString = () => {
        return `Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, `
         + `Private: ${this.isPrivate}, Deadline: ${this.formatDeadline('MMMM DD, YYYY h:mmA')}`;
    };
}

function TaskList() {
    this.myTasks = [];
    this.add = task => this.myTasks.push(task);
}

function load() {
    let tasks = new TaskList();
    return new Promise((resolve, reject) => {
        
        const query = 'SELECT * FROM tasks';
        db.all(query, (err, rows) => {
            if(err) reject(err);
            else {
                rows.forEach((el) => {
                    const newTask = new Task(el.id, el.description, el.urgent, el.private, el.deadline);
                    tasks.add(newTask);
                });
                resolve(tasks);
            }
        });
    });
}


function loadWithDeadline(deadline) {
    let tasks = new TaskList();
    return new Promise((resolve, reject) => {
        
        const query = 'SELECT * FROM tasks WHERE tasks.deadline > ?';
        db.all(query, [deadline.format()], (err, rows) => {
            if(err) reject(err);
            else {
                rows.forEach((el) => {
                    const newTask = new Task(el.id, el.description, el.urgent, el.private, el.deadline);
                    tasks.add(newTask);
                });
                resolve(tasks);
            }
        });
    });
}

function loadWithWord(word) {
    let tasks = new TaskList();
    return new Promise((resolve, reject) => {
        
        const query = 'SELECT * FROM tasks WHERE tasks.description LIKE ?';
        db.all(query, ['%' + word + '%'], (err, rows) => {
            if(err) reject(err);
            else {
                rows.forEach((el) => {
                    const newTask = new Task(el.id, el.description, el.urgent, el.private, el.deadline);
                    tasks.add(newTask);
                });
                resolve(tasks);
            }
        });
    });
}


async function main() {
    console.log("****** All the tasks in the database: ******");
    const tasks = await load();
    tasks.myTasks.forEach(t => console.log(t.toString()));
    console.log();
    

    const deadline = dayjs('2021-03-13T09:00:00.000Z');
    console.log("****** Tasks after " + deadline.format() + ": ******");
    const tasksWithDeadline = await loadWithDeadline(deadline);
    tasksWithDeadline.myTasks.forEach(t => console.log(t.toString()));
    console.log();

    //get tasks with a given word in the description
    const word = "phone";
    console.log("****** Tasks containing '" + word + "' in the description: ******");
    const filteredTasks = await loadWithWord(word);
    filteredTasks.myTasks.forEach( (task) => console.log(task.toString()) );

    debugger;
}

main();
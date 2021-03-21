'use strict';

const dayjs = require('dayjs');

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

    this.sortAndPrint = () => {
        const sorted = [... this.myTasks];

        sorted.sort((a,b) => {
            if (a.formatDeadline() === '<not defined>') return 1; // undefined larger
            if (b.formatDeadline() === '<not defined>') return -1;

            if (dayjs(a.deadline).isAfter(dayjs(b.deadline))) return 1;
            
            return -1;
        });

        sorted.forEach((el) => {
            console.log(el.toString());
        });
    };


    this.filterAndPrint = () => {
        // filter tasks that are not urgent
        this.myTasks.filter( (t) => t.isUrgent).forEach( (t) => console.log(t.toString()));
    };
}

const laundry = new Task(1, 'laundry', true, false, '2021-03-24T22:37:16+00:00');
const tennis = new Task(2, 'tennis', false, true, '2021-03-22T12:00:00+00:00');
const club = new Task(3, 'club');
console.log(laundry.toString());
console.log(tennis.toString());
console.log(club.toString());

let tasks = new TaskList();
tasks.add(laundry);
tasks.add(tennis);
tasks.add(club);

console.log();
tasks.sortAndPrint();

console.log();
tasks.filterAndPrint();
'use strict';

const dayjs = require('dayjs');

function Task(id, description, isUrgent = false, isPrivate = false, deadline = '') {
    this.id = id;
    this.description = description;
    this.isUrgent = isUrgent;
    this.isPrivate = isPrivate;

    this.deadline = deadline;

    if (this.deadline){
        this.deadline = dayjs(deadline);
    }
    else {
        this.deadline = '<not defined>';
    }


    this.toString = () => {
        return `Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, `
         + `Private: ${this.isPrivate}, Deadline: ${this.deadline.format('MMMM DD, YYYY HHA')}`;
    };
}

const task = new Task(1, 'laundry', false, true, '2021-03-21T11:37:16+00:00');
console.log(task.toString());
$(document).ready(function() {

    var taskInput = $('#new-task');
    var addBtn = $('#addToDo');
    var incompleteTasksHolder = $('#incomplete-tasks');
    var completedTasksHolder = $('#completed-tasks');

    var createNewToDoItem = function(taskInputValue) {
    	var $listItem = $('<li></li>');

    	var $checkbox = $('<input>');
    	$checkbox.attr('type', 'checkbox');
    	$checkbox.attr('id', 'chbstyle');

    	var $label = $('<label for="chbstyle"></label>');
    	var $p = $('<p>' + taskInputValue + '</p>');
    	
    	var $editInput = $('<input>');
    	$editInput.attr('type', 'text');

    	var $editBtn = $('<button></button>');
    	$editBtn.addClass('edit');
    	$editBtn.text("Edit");

    	var $deleteBtn = $('<button></button>');
    	$deleteBtn.addClass('delete');
    	$deleteBtn.text('Delete');

    	$listItem.append($checkbox);
    	$listItem.append($label);
    	$listItem.append($p);
    	$listItem.append($editInput);
    	$listItem.append($editBtn);
    	$listItem.append($deleteBtn);

        return $listItem;
    }

    var addTask = function() {
    	var inputValue = taskInput.val();
    	var sortList = $('.sortable');
		var listItem = createNewToDoItem(inputValue);
		incompleteTasksHolder.append(listItem);
		bindTaskEvents(listItem, taskCompleted);
    	taskInput.val("").focus();
    	
    	sortList.sortable('destroy');
        sortList.sortable();

    	displayClearAll(incompleteTasksHolder);

    	localStorage.setItem('todoList', incompleteTasksHolder.html());
    	localStorage.setItem('completedList', completedTasksHolder.html());
    }

    addBtn.on('click', function() {
    	if (taskInput.val() !== '') {
    		addTask();
    	}
    }); 

    $('.sortable').sortable().bind('sortupdate', function() {
		localStorage.setItem('todoList', incompleteTasksHolder.html());
	});

    var editTask = function() {
    	console.log('editTask');
    	var editBtn = $(this);
    	var listItem = editBtn.parent();
        var editInput = listItem.find('input[type="text"]');
        var p = listItem.find('p');

        if (listItem.hasClass('editMode')) {
        	p.html(editInput.val());
            editBtn.text('Edit');
        } else {
        	editInput.val(p.html());
        	editBtn.text('Done');
        }
        listItem.toggleClass('editMode');

        localStorage.setItem('todoList', incompleteTasksHolder.html());
    	localStorage.setItem('completedList', completedTasksHolder.html());
    }

    var deleteTask = function() {
        var listItem = $(this).parent();
        if (confirm("Are you sure?")) {
            listItem.remove();
        }
        displayClearAll(incompleteTasksHolder);
    	displayClearAll(completedTasksHolder);

    	localStorage.setItem('todoList', incompleteTasksHolder.html());
    	localStorage.setItem('completedList', completedTasksHolder.html());
    }

    var taskCompleted = function(e) {
    	var listItem = $(this).parent();
    	console.log('taskCompleted!');
    	completedTasksHolder.append(listItem);
    	bindTaskEvents(listItem, taskIncomplete);

    	displayClearAll(incompleteTasksHolder);
    	displayClearAll(completedTasksHolder);

    	localStorage.setItem('todoList', incompleteTasksHolder.html());
    	localStorage.setItem('completedList', completedTasksHolder.html());
    }

    var taskIncomplete = function(e) {
    	var listItem = $(this).parent();
    	incompleteTasksHolder.append(listItem);
    	bindTaskEvents(listItem, taskCompleted);

    	displayClearAll(incompleteTasksHolder);
    	displayClearAll(completedTasksHolder);

    	localStorage.setItem('todoList', incompleteTasksHolder.html());
    	localStorage.setItem('completedList', completedTasksHolder.html());
    }

    var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    	console.log("bind Event!");

    	var checkBox = taskListItem.find('input[type="checkbox"]');
    	var editBtn = taskListItem.find('button.edit');
    	var deleteBtn = taskListItem.find('button.delete');
        
        editBtn.unbind('click').bind('click', editTask);
    	deleteBtn.unbind('click').bind('click', deleteTask);
    	checkBox.unbind('change').bind('change', checkBoxEventHandler);
    }

    var displayClearAll = function(taskHolder) {
    	var CountListItem = taskHolder.find("li").length;
    	if (CountListItem > 0) {
    		taskHolder.prev().find('span.itemsNum').text("(" + CountListItem + " Items)");
    	} else {
    		taskHolder.prev().find('span.itemsNum').text('');
    	}
		if (CountListItem > 1) {
			taskHolder.prev().find('.doClearAll').css('display','block');
		} else {
			taskHolder.prev().find('.doClearAll').css('display','none');
		}
    }

    displayClearAll(incompleteTasksHolder);
    displayClearAll(completedTasksHolder);

    $('#todoClearAll').on('click', function(e) {
    	e.preventDefault();
    	if (confirm("Are you sure to clean them all?")) {
    	   incompleteTasksHolder.children().remove();
    	}
        taskInput.val("").focus();
        localStorage.setItem('todoList', incompleteTasksHolder.html());
    });

    $('#completedClearAll').on('click', function(e) {
        e.preventDefault();
        if (confirm("Are you sure to clean them all?")) {
    	   completedTasksHolder.children().remove();
    	}
        taskInput.val("").focus();
        localStorage.setItem('completedList', completedTasksHolder.html());
    });

    loadToDo();

	function loadToDo() {
	  if (localStorage.getItem('todoList') || localStorage.getItem('completedList')) {
		   incompleteTasksHolder.html(localStorage.getItem('todoList')); 
		   completedTasksHolder.html(localStorage.getItem('completedList'));
		   $('.sortable').sortable('destroy');
		   $('.sortable').sortable();
   
		   displayClearAll(incompleteTasksHolder);
           displayClearAll(completedTasksHolder); 

           incompleteTasksHolder.find('li').each(function() {
	    	   bindTaskEvents($(this), taskCompleted);	
	       });

	       completedTasksHolder.find('li').each(function() {
	    	   bindTaskEvents($(this), taskIncomplete);
	    	   console.log($(this).find('input[type="checkbox"]'));
	    	   $(this).find('input[type="checkbox"]').prop({
	    	   	   checked: true
	    	   });
	       });	
      }
    }
});
$(document).ready(function() {

    var taskInput = $('#new-task');
    var addBtn = $('#addToDo');
    var incompleteTasksHolder = $('#incomplete-tasks');
    var completedTasksHolder = $('#completed-tasks');

    var createNewToDoItem = function(taskInputValue) {
    	var $listItem = $('<li></li>');

        var $div = $('<div></div>');
        $div.addClass('chbLab');
    	var $checkbox = $('<input>');
    	$checkbox.attr('type', 'checkbox');
    	$checkbox.attr('id', 'chbstyle');

    	var $label = $('<label for="chbstyle"></label>');
    	var $p = $('<p>' + taskInputValue + '</p>');
    	
    	var $editInput = $('<input>');
    	$editInput.attr('type', 'text');

    	var $editBtn = $('<button><i class="fa fa-edit"></i>Edit</button>');
    	$editBtn.addClass('edit');

    	var $deleteBtn = $('<button><i class="fa fa-close"></i>Delete</button>');
    	$deleteBtn.addClass('delete');

    	$div.append($checkbox);
    	$div.append($label);
    	$listItem.append($div);
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
    	displayClearAll(completedTasksHolder);

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
            editBtn.html('<i class="fa fa-edit"></i>Edit');
        } else {
        	editInput.val(p.html());
        	editBtn.html('<i class="fa fa-check-circle-o"></i>Done');
        }
        listItem.toggleClass('editMode');

        localStorage.setItem('todoList', incompleteTasksHolder.html());
    	localStorage.setItem('completedList', completedTasksHolder.html());
    }

    var deleteTask = function() {
        var listItem = $(this).parent();
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this task!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function(isConfirm){
            if (isConfirm){
              swal("Deleted successfully!", "The task has been deleted!", "success");
              listItem.remove();
              displayClearAll(incompleteTasksHolder);
    		  displayClearAll(completedTasksHolder);
              localStorage.setItem('todoList', incompleteTasksHolder.html());
    		  localStorage.setItem('completedList', completedTasksHolder.html());
            } else {
              swal("Cancelled", "The task is safe :)", "error");
            }
          });  
    }

    var taskCompleted = function(e) {
    	var listItem = $(this).parent().parent();
    	console.log('taskCompleted!');
    	completedTasksHolder.append(listItem);
    	bindTaskEvents(listItem, taskIncomplete);

    	displayClearAll(incompleteTasksHolder);
    	displayClearAll(completedTasksHolder);

    	localStorage.setItem('todoList', incompleteTasksHolder.html());
    	localStorage.setItem('completedList', completedTasksHolder.html());
    }

    var taskIncomplete = function(e) {
    	var listItem = $(this).parent().parent();
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
    	var label = taskListItem.find('label');
    	var editBtn = taskListItem.find('button.edit');
    	var deleteBtn = taskListItem.find('button.delete');
        
        editBtn.unbind('click').bind('click', editTask);
    	deleteBtn.unbind('click').bind('click', deleteTask);
    	// checkBox.unbind('change').bind('change', checkBoxEventHandler);
    	label.unbind('click').bind('click', checkBoxEventHandler);
    }

    var displayClearAll = function(taskHolder) {
    	var CountListItem = taskHolder.find("li").length;
    	if (CountListItem > 0) {
    		taskHolder.prev().find('span.itemsNum').text(CountListItem);
    		taskHolder.prev().find('span.items').css('display', 'inline-block');
    	} else {
    		taskHolder.prev().find('span.itemsNum').text('');
    		taskHolder.prev().find('span.items').css('display', 'none');
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
    	swal({
            title: "Are you sure?",
            text: "You will not be able to recover all the tasks!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function(isConfirm){
            if (isConfirm){
              swal("Deleted successfully!", "All tasks have been deleted!", "success");
              incompleteTasksHolder.children().remove();
              displayClearAll(incompleteTasksHolder);
              localStorage.setItem('todoList', incompleteTasksHolder.html());
            } else {
              swal("Cancelled", "The tasks are safe :)", "error");
            }
        });
        taskInput.val("").focus();
    });

    $('#completedClearAll').on('click', function(e) {
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover all the tasks!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function(isConfirm){
            if (isConfirm){
              swal("Deleted successfully!", "All tasks have been deleted!", "success");
              completedTasksHolder.children().remove();
              displayClearAll(completedTasksHolder);
              localStorage.setItem('completedList', completedTasksHolder.html());
            } else {
              swal("Cancelled", "The tasks are safe :)", "error");
            }
        });
    	
        taskInput.val("").focus();
    });

    function date() {
    	var time = new Date();
    	var months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
    	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	    var day = days[time.getDay()];
	    var year = time.getFullYear();
	    var month = months[time.getMonth()];
	    var date = time.getDate();
	    var ndate = day + ' ' + month + ' ' + date + ' ' + year;
	    return ndate;
    }
    
    var time = date();
    $('#date').append(time);
    
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
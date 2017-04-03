// this is where you establish the app
var app = angular.module('todoApp', ['ngRoute'])
.config(function ($routeProvider) {
  // this is the router 
  $routeProvider.when('/:status', {
    controller : 'todoCtrl'
  });
});

app.factory('todo', function() {
  // this is a factory for a todo list and all of the functions
  // available to the todo list

  function guid() {
    // function to create unique id for each todo
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  return {
    todos : [],
    add : function(title, completed) {
      this.todos.push({id : guid(),
          title : title, completed : completed || false});
    },
    save : function(id, title) {
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].id === id) {
          this.todos[i].title = title;
        }
      }
    },
    remove : function(id) {
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].id === id) {
          this.todos.splice(i, 1);
        }
      }
    },
    toggle : function(id, status) {
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].id === id) {
          this.todos[i].completed = status ? status : !this.todos[i].completed;
        }
      }
    }
  };
});

app.directive('todoItem', function() {
  return {
    restrict : 'A',
    link : function(scope, e, attr) {
      
      function removeEditing() {
        [].slice.call(document.querySelectorAll('.editing'))
          .forEach(function(el) {
            el.classList.remove('editing');
        });
      }
      
      e.on('keydown', function(ev) {
        if (ev.code === 'Enter') {
          removeEditing();
        }
      });
      
      e.on('click', function(ev) {
        if (ev.target.tagName === 'INPUT') { return ;}
        removeEditing();
      });
      e.on('dblclick', function(ev) {
        ev.target.parentNode.parentNode.classList.add('editing');
      });
    }
  };
});

app.directive('totalTodos', function() {
  return {
    restrict : 'A',
    link : function(scope, e) {
      scope.$watch('todos', function() {
        var total = scope.todos.filter(function(t) {
          return t.completed === false;
        }).length;
        scope.totals = total;
      }, true);
    },
    template : '{{totals}}'
  };
});

app.controller('todoCtrl', function($scope, $routeParams, todo) {
  $scope.status = null;
  $scope.$on('$routeChangeSuccess', function(e,p) {
    $scope.status = p ? p.params.status : null;
  });
  $scope.todos = todo.todos;
  
  $scope.toggle = function(id) { todo.toggle(id); };
  
  $scope.save = function(ev, id, title) { 
    if (ev.code === 'Enter' && title.length > 0) {
      todo.save(id, title);
    }
  };
  
  $scope.remove = function(id) { todo.remove(id); };
  
  $scope.createTodo = function(ev, title) {
    if (ev.code === 'Enter' && title.length > 0) {
      todo.add(title, false);
      ev.target.value = '';
    }
  };
  
  $scope.toggleAll = function(ev) {
    var state = ev.target.checked;
    $scope.todos.forEach(function(t) {
      todo.toggle(t.id, state);
    });
  };
  
  $scope.clearCompleted = function() {
    var toremove = [];
    $scope.todos.forEach(function(t) {
      if (t.completed === true) {
        toremove.push(t.id);
      }
    });
    toremove.forEach(function(id) { todo.remove(id); } );
  };
  
  todo.add('Publish and forget', false);
  todo.add('Make filtering support', true);
  todo.add('Display todos list', true);
  todo.add('Create todo boilerplate', true);
});
'use strict';
var willow = angular.module('willow', []);

willow.controller('mapListCtrl', function ($scope) {
    var bg = chrome.extension.getBackgroundPage();

    //保存规则数据到localStorage
    function saveData() {
        bg.localStorage.WillowRoute = angular.toJson($scope.maps);
    }

    $scope.maps = bg.WillowRoute;

    //编辑框显示状态
    $scope.editDisplay = 'none';

    $scope.addDisplay= 'block';

    //编辑框保存按钮文本
    $scope.editType = '添加';

    //输入错误时候的警告
    $scope.inputError = '';

    //隐藏编辑框
    $scope.hideEditBox = function () {
        $scope.editDisplay = 'none';
        $scope.addDisplay= 'block';
    }

    //显示编辑框
    $scope.showEditBox = function () {
        $scope.editDisplay = 'block';
        $scope.addDisplay= 'none';
        setTimeout(function(){
            document.getElementById('req').select();
        }, 55);
    }

    //验证输入合法性
    $scope.virify = function () {
        if (!$scope.curRule.req || !$scope.curRule.res) {
            $scope.inputError = '输入不能为空';
            return false;
        }
        try {
            new RegExp($scope.curRule.req)
        } catch (e) {
            $scope.inputError = '正则格式错误';
            return false;
        }
        $scope.inputError = '';
        return true;
    }

    // 点击添加按钮
    $scope.addRule = function () {
        $scope.curRule = {
            req: 'http://www.pingan.com/',
            res: 'http://127.0.0.1:8080/',
            checked: true
        };
        $scope.editType = '添加';
        $scope.showEditBox();
    };

    //点击编辑按钮
    $scope.edit = function (rule) {
        $scope.curRule = rule;
        $scope.editType = '编辑';
        $scope.showEditBox();
    }

    //编辑后保存
    $scope.saveRule = function () {
        if ($scope.virify()) {
            if ($scope.editType === '添加') {
                $scope.maps.push($scope.curRule);
            } else {

            }
            saveData();
            $scope.hideEditBox();
        }
    };

    //删除规则
    $scope.removeUrl = function (rule) {
        for (var i = 0, len = $scope.maps.length; i < len; i++) {
            if ($scope.maps[i] === rule) {
                $scope.maps.splice(i, 1);
            }
        }
        saveData();
    }
});
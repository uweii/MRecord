const dbHelper = {}
const dbName = "mrecord"
const dbPath = "_doc/mrecord.db"
const tbName = "record"


dbHelper.isDbOpen = function() {
	return plus.sqlite.isOpenDatabase({
		name: dbName,
		path: dbPath
	});
}

// 打开数据库
dbHelper.openDB = function() {
	if (!dbHelper.isDbOpen()) {
		plus.sqlite.openDatabase({
			name: dbName,
			path: dbPath,
			success: function(e) {
				console.log('openDatabase success!');
			},
			fail: function(e) {
				console.log('openDatabase failed: ' + JSON.stringify(e));
			}
		});
	}
}

// 关闭数据库
dbHelper.closeDB = function() {
	if (dbHelper.isDbOpen()) {
		plus.sqlite.closeDatabase({
			name: dbName,
			success: function(e) {
				console.log('closeDatabase success!');
			},
			fail: function(e) {
				console.log('closeDatabase failed: ' + JSON.stringify(e));
			}
		});
	}
}


// 执行SQL语句
dbHelper.initDB = function() {
	dbHelper.openDB()
	plus.sqlite.executeSql({ //主键, 金额, 时间, 类型(0 收入｜1 支出), 标签, 心情, 备注 
		name: dbName,
		sql: 'create table if not exists ' + tbName +
			' ("id" INTEGER PRIMARY KEY AUTOINCREMENT,"money" CHAR(20),"time" CHAR(30), "type" INT(1), "tag" CHAR(30), "moon" INT(2), "remarks" CHAR(50))',
		success: function(e) {
			console.log('creat table success');
		},
		fail: function(e) {
			console.log('create table failed failed: ' + JSON.stringify(e));
		}
	});
	dbHelper.closeDB()
}

dbHelper.save = function(record) {
	dbHelper.openDB() //打开数据库
	//构建sql
	const fixed = "\"" + record.money + "\"," + "\"" + record.time + "\"," + "\"" + record.type + "\"," + "\"" +
		record.tag + "\"," + "\"" +
		record.moon + "\"," + "\"" + record.remarks + "\""
	const sql = 'insert into ' + tbName + '(money, time, type,tag, moon, remarks) values(' + fixed + ')'
	return new Promise((resolve,reject)=>{
		plus.sqlite.executeSql({
			name: dbName,
			sql: sql,
			success: function(e) {
				console.log('save success!');
				dbHelper.closeDB()
				resolve(e)
			},
			fail: function(e) {
				console.log('save failed: ' + JSON.stringify(e));
				dbHelper.closeDB()
				reject(e)
			}
		});
	})
	
}

dbHelper.delete = function(id) {
	dbHelper.openDB()
	//构建sql
	const sql = 'delete from ' + tbName + ' where id = ' + id
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name: dbName,
			sql: sql,
			success: function(e) {
				console.log('delete success!');
				dbHelper.closeDB()
				resolve(e)
			},
			fail: function(e) {
				console.log('delete failed: ' + JSON.stringify(e));
				dbHelper.closeDB()
				reject(e)
			}
		})
	})

}

Date.prototype.format = function(fmt) { //author: meizz   
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"h+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//分页查询
dbHelper.selectAll = function(page) {
	var list = []
	dbHelper.openDB()
	// 查询SQL语句
	const date = new Date()
	const fromtime = date.format('yyyy-MM')
	return new Promise(
		(resolve, reject) => {
			plus.sqlite.selectSql({
				name: dbName,
				sql: 'select * from ' + tbName + ' where time >= "' + fromtime + '" order by time desc limit ' + (page - 1) * 8 +
					', 8',
				success: function(data) {
					console.log('selectSql success: ');
					dbHelper.closeDB()
					resolve(data)
				},
				fail: function(e) {
					console.log('selectSql failed: ' + JSON.stringify(e));
					dbHelper.closeDB()
					reject(e)
				}
			});
		}
	)
}

//按条件查询所有
dbHelper.analysis = function(offset, end, containsEnd) {
	var list = []
	dbHelper.openDB()
	console.log("查询" + offset + "到" + end + "的记录")
	let sqlcondition = ''
	if (containsEnd) {
		sqlcondition = 'select * from ' + tbName + ' where time >= "' + offset + '" and time <= "' + end + '"' +
			" order by time desc"
	} else {
		sqlcondition = 'select * from ' + tbName + ' where time >= "' + offset + '" and time < "' + end + '"' +
			" order by time desc"
	}
	return new Promise(
		(resolve, reject) => {
			plus.sqlite.selectSql({
				name: dbName,
				sql: sqlcondition,
				success: function(data) {
					console.log('按条件查询成功 ');
					dbHelper.closeDB()
					resolve(data)
				},
				fail: function(e) {
					console.log('selectSql failed: ' + JSON.stringify(e));
					dbHelper.closeDB()
					reject(e)
				}
			});
		}
	)
}

export default dbHelper

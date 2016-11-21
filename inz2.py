from serial import Serial
import time
from datetime import datetime
import mysql.connector
import MySQLdb as sql

#serialPort = Serial('/dev/ttyACM1',9600,timeout=1)
serialPort = Serial('COM3',9600,timeout=1)
serialPort.flushInput()
fault = False
index = 1
last_time_motion = datetime(1000, 10, 24, 12, 44, 14)
last_time_water = datetime(1000, 10, 24, 12, 44, 14)
last_time_smoke = datetime(1000, 10, 24, 12, 44, 14)
motion_limit = 60
water_limit = 60
smoke_limit = 60
start_time = datetime.now()
buf_start = 10

cnx = sql.connect("localhost", "filip", "nowehaslo123", "alarms")
cursor = cnx.cursor()
query = "select * from alarmsTable2"
cursor.execute(query)
result = cursor.fetchall()
if(not(len(result) == 0)):
    for r in result:
        print r
    index = r[0] + 1
cnx.commit()

cursor.close()
cnx.close()

print "Zczytywanie danych pomiarowych"
while True:
        now_time = datetime.now()
        inString = serialPort.read()
        time.sleep(0.1)
        data_left = serialPort.inWaiting()
        inString += serialPort.read(data_left)
        data = inString.split("|")
        if ((now_time-start_time).total_seconds()>buf_start):
            if len(data) == 2:
                for i in range(len(data)):
                    if len(data[i]) == 0:
                            fault = True
                if not (fault):
                    cnx = sql.connect("localhost", "filip", "nowehaslo123", "alarms")
                    cursor = cnx.cursor()
                    if (data[0] == '4'):
                        print "ruch"
                        if ((now_time - last_time_motion).total_seconds() < motion_limit):
                            last_time_motion = now_time;
                        else:
                            query = ("insert into alarmsTable2  VALUES (%s, %s, %s)")
                            cursor.execute(query, (index, 'move', now_time))
                            cnx.commit()
                            index = index + 1
                            last_time_motion = now_time

                    if(data[0]== '1'):
                        print "powodz"
                        if ((now_time - last_time_water).total_seconds() < water_limit):
                            last_time_water = now_time
                        else:
                            query = ("insert into alarmsTable2  VALUES (%s, %s, %s)")
                            cursor.execute(query, (index, 'water', now_time))
                            cnx.commit()
                            index = index + 1
                            last_time_water = now_time

                    if(data[0]== '2'):
                        print "pozar"
                        if ((now_time - last_time_smoke).total_seconds() < water_limit):
                            last_time_smoke = now_time
                        else:
                            query = ("insert into alarmsTable2  VALUES (%s, %s, %s)")
                            cursor.execute(query, (index, 'Smoke', now_time))
                            cnx.commit()
                            index = index + 1
                            last_time_smoke = now_time

                    if(data[0]== '3'):
                        print "Kontaktron"
                        query = ("insert into alarmsTable2  VALUES (%s, %s, %s)")
                        cursor.execute(query, (index, 'Kontaktron1', now_time))
                        cnx.commit()
                        index = index + 1

                    cursor.close()
                    cnx.close()


                fault = False
        serialPort.flushInput();

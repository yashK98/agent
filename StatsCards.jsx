import os
import jpype
import jaydebeapi

# ------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------

JAVA_HOME = r"C:\Program Files\Java\jdk-17"
JDBC_JAR = r"C:\drivers\HiveJDBC42.jar"

ZK_HOSTS = (
    "hkimou0gbe20a00.hk.standardchartered.com:2181,"
    "hkimou0gbe20a01.hk.standardchartered.com:2181"
)

JDBC_URL = (
    f"jdbc:hive2://{ZK_HOSTS}/default;"
    "serviceDiscoveryMode=zooKeeper;"
    "zooKeeperNamespace=hiveserver2;"
    "transportMode=http;"
    "httpPath=cliservice;"
    "ssl=true;"
    "principal=hive/_HOST@ZONE1.SCBDEV.NET;"
)

DRIVER_CLASS = "com.cloudera.hive.jdbc.HS2Driver"

# ------------------------------------------------------------------
# JVM STARTUP
# ------------------------------------------------------------------

if not jpype.isJVMStarted():

    jvm_path = jpype.getDefaultJVMPath()

    jpype.startJVM(
        jvm_path,
        "-Xms256m",
        "-Xmx1024m",
        f"-Djava.class.path={JDBC_JAR}",
        convertStrings=True,
    )

# ------------------------------------------------------------------
# CONNECT
# ------------------------------------------------------------------

conn = jaydebeapi.connect(
    DRIVER_CLASS,
    JDBC_URL,
    [],
    JDBC_JAR
)

cursor = conn.cursor()

cursor.execute("select current_database()")

for row in cursor.fetchall():
    print(row)

cursor.close()
conn.close()
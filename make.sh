mvn clean package -P dev
#upl dist/tracker.js

# scp dist/* root@hadoop1:/data/work/tracker/
# scph1 dist/tracker.js /data/work/tracker/
# scph1 dist/tracker-view.js /data/work/tracker/
# scph1 dist/tracker-view-v2.js /data/work/tracker/
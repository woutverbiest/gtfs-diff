# GTFS-Diff

compares large linked connection files and outputs the difference in 3 files: the new connections, the updated connections, the removed connections. The connections that haven't changed are not stored.

## env
the env file requires one variable

```
STORAGE= //the location of the storage
```

## bugs
The removed is not implemented well yet.
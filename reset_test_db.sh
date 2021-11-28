#! /bin/bash
dropdb slack-test
createdb slack-test
psql testslack < dump.sql

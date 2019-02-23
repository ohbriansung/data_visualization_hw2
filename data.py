# https://stackoverflow.com/questions/29725932/deleting-rows-with-python-in-a-csv-file
import csv

with open('mrc_table2.csv', 'r') as inp, open('mrc_table2_edited.csv', 'w') as out:
    writer = csv.writer(out)
    header = 0

    for row in csv.reader(inp):
        if header == 0:
            writer.writerow(row)
            header = 1
        elif int(row[3]) <= 12:  # only include tiers 1 to 12
            writer.writerow(row)

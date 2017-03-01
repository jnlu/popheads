import operator
import math
import re

usernames = [] #This list holds all of the usernames

songComments = {} #This dictionary's keys are the song titles, and the values are lists with all of the comments (with usernames attached)
songAvgScores = {} #This dictionary's keys are the song titles, and the values are the current average
songAllScores = {} #This dictionary's keys are the song titles, and the values are the lists that contain just the scores
songAllScoresWithNames = {} #This dictionary's keys are the song titles, and the values are another dictionary that contain a username and a score

bonusComments = {}
bonusAvgScores = {}
bonusAllScores = {}
bonusAllScoresWithNames = {}

albumOverallAverages = {} #This dictionary's keys are album titles, and the values are a list with every single score it received
albumUserAverages = {} #This dictionary's keys are the album titles, and the values are another dictionary that contain a username and an average
albumAllComments = {} #This dictionary's keys are the album titles, and the values are a list that contain a username and comment

def parsevotes(datafile):
	gaveZero = False
	gaveEleven = False
	bonus = False
	username = ""
	albumAllScores = []

	regexSong = r"(.+?):\s*([\d\.]+)?\s*(.+)?"
	regexAlbum = r"Album:\s*([^:]+):?\s*(.+)?"
	regexUsername = r"Username:\s*(.+)"
	for line in datafile:
		if not line.isspace():
			line = line.strip('\n').strip()
			if line.startswith("Username"):
				if username != "":
					print("Error: The username '%s' did not end properly. Exiting program."% (username))
					return 1
				username = re.findall(regexUsername, line)[0]
				if username in usernames:
					print("Error: The username '%s' appeared twice. Exiting program."% (username))
					return 1
				usernames.append(username)
			elif line.startswith("Album"):
				bonus = False
				if len(albumAllScores) != 0:
					albumUserAverages[album][username] = (sum(albumAllScores) / max(1, len(albumAllScores)))
				albumAllScores[:] = []
				albumAndComment = re.findall(regexAlbum, line)[0]
				album = albumAndComment[0].strip('\n').strip()
				if len(albumAndComment) > 1:
					if album not in albumAllComments:
						albumAllComments[album] = []
					albumComment = albumAndComment[1].strip('\n').strip()
					if albumComment:
						albumAllComments[album].append("**%s**: %s" % (username, albumComment)) 
				if album not in albumOverallAverages:
					albumOverallAverages[album] = []
				if album not in albumUserAverages:
					albumUserAverages[album] = {}
			elif line.startswith("END"):
				#print("Added %s!"% (username))
				if len(albumAllScores) != 0:
					albumUserAverages[album][username] = (sum(albumAllScores) / max(1, len(albumAllScores)))
				albumAllScores[:] = []
				bonus = False
				gaveZero = False
				gaveEleven = False
				username = ""
			elif line.startswith("BONUS TRACKS"):
				bonus = True
			else:
				songScore = 200
				songScoreComment = re.findall(regexSong, line)[0]
				songName = songScoreComment[0].strip('\n').strip()

				if not bonus:
					if songName not in songComments:
						songComments[songName] = []
					if songName not in songAvgScores:
						songAvgScores[songName] = 0
					if songName not in songAllScores:
						songAllScores[songName] = []
					if songName not in songAllScoresWithNames:
						songAllScoresWithNames[songName] = {}

					if len(songScoreComment) > 1:
						if songScoreComment[1]:
							songScore = float(songScoreComment[1].strip('\n').strip())
					if len(songScoreComment) == 3:
						if songScoreComment[2]:
							songComment = songScoreComment[2].strip('\n').strip()
							songComments[songName].append("**%s**: \"%s\"\n"% (username, songComment))

					if (songScore == 200):
						print("Error: User '%s' did not give a score to track '%s'. Exiting program."% (username, songName))
						return 1
					if ((songScore < 1 and songScore != 0) or (songScore > 10 and songScore != 11)):
						print("Error: User '%s' gave an invalid score to track '%s'. Exiting program."% (username, songName))
						return 1
					if (songScore == 0):
						if (gaveZero == True):
							print("Error: User '%s' gave two zeros. Triggered for song '%s'. Exiting program."% (username, songName))
							return 1
						else:
							gaveZero = True
					if (songScore == 11):
						if (gaveEleven == True):
							print("Error: User '%s' gave two elevens. Triggered for song '%s'. Exiting program."% (username, songName))
							return 1
						else:
							gaveEleven = True

					albumOverallAverages[album].append(songScore)
					albumAllScores.append(songScore)
					songAllScores[songName].append(songScore)
					songAllScoresWithNames[songName][username] = songScore

				else:
					if len(songScoreComment) > 1:
						if songScoreComment[1]:
							songScore = float(songScoreComment[1].strip('\n').strip())
					if songName not in bonusComments:
						bonusComments[songName] = []
					if songName not in bonusAvgScores:
						bonusAvgScores[songName] = 0
					if songName not in bonusAllScores:
						bonusAllScores[songName] = []
					if songName not in bonusAllScoresWithNames:
						bonusAllScoresWithNames[songName] = {}

					if songScore != 200:
						if (songScore == 0):
							print("Error: User '%s' gave a zero to the bonus track '%s'. Exiting program."% (username, songName))
							return 1
						if (songScore == 11):
							print("Error: User '%s' gave an eleven to the bonus track '%s'. Exiting program."% (username, songName))
							return 1
						if (songScore < 1 or songScore > 10):
							print("Error: User '%s' gave an invalid score to track '%s'. Exiting program."% (username, songName))
							return 1

						if len(songScoreComment) == 3:
							if songScoreComment[2]:
								songComment = songScoreComment[2].strip('\n').strip()
								bonusComments[songName].append("**%s**: \"%s\"\n"% (username, songComment))
						
						bonusAllScores[songName].append(songScore)
						bonusAllScoresWithNames[songName][username] = songScore

	for song in songAvgScores:
		songAvgScores[song] = float(sum(songAllScores[song]) / max(len(songAllScores[song]), 1))
	for song in bonusAvgScores:
		bonusAvgScores[song] = float(sum(bonusAllScores[song]) / max(len(bonusAllScores[song]), 1))
	return 0

def findControversy(scores):
	num_items = len(scores)
	mean = sum(scores) / max(1, num_items)
	differences = [x - mean for x in scores]
	sq_differences = [d ** 2 for d in differences]
	ssd = sum(sq_differences)
	return math.sqrt(ssd / num_items)

def findHighestLowestScores(scores, outputfile, average):
	highest = {}
	lowest = {}
	highestScore = -20
	lowestScore = 20
	sorted_scores = sorted(scores.items(), key=operator.itemgetter(1))
	for song in sorted_scores:
		if song[1] > highestScore:
			if song[1] != 11:
				highestScore = song[1]
		if song[1] < lowestScore:
			if song[1] != 0:
				lowestScore = song[1]
	for song in sorted_scores:
		if song[1] == 11:
			if 11 not in highest:
				highest[11] = []
			highest[11].append(song[0])
		elif (highestScore - song[1]) < 2 and (song[1] - 0.5 > average):
			if song[1] not in highest:
				highest[song[1]] = []
			highest[song[1]].append(song[0])
		if song[1] == 0:
			if 0 not in lowest:
				lowest[0] = []
			lowest[0].append(song[0])
		elif (song[1] - lowestScore) < 2 and (song[1] + 0.5 < average):
			if song[1] not in lowest:
				lowest[song[1]] = []
			lowest[song[1]].append(song[0])
	outputfile.write("**Highest scores:** ")
	for key in reversed(sorted(highest)):
		if int(key) == float(key):
			outputfile.write("(%d x%d) "% (key, len(highest[key])))
		else:
			outputfile.write("(%.1f x%d) "% (key, len(highest[key])))
		lastusername = highest[key][-1]
		for username in highest[key]:
			outputfile.write("%s"% (username))
			if (username != lastusername):
				outputfile.write(", ")
			else:
				outputfile.write(" ")
	outputfile.write("\n\n**Lowest Scores:** ")
	for key in sorted(lowest):
		if int(key) == float(key):
			outputfile.write("(%d x%d) "% (key, len(lowest[key])))
		else:
			outputfile.write("(%.1f x%d) "% (key, len(lowest[key])))
		lastusername = lowest[key][-1]
		for username in lowest[key]:
			outputfile.write("%s"% (username))
			if (username != lastusername):
				outputfile.write(", ")
			else:
				outputfile.write(" ")
	outputfile.write("\n\n**[All scores]()**\n\n---\n")

def printResults(outputfile):
	numParticipants = len(usernames)
	totalSongs = 1
	totalBonusSongs = 1
	sorted_scores = sorted(songAvgScores.items(), key=operator.itemgetter(1))
	bonus_sorted_scores = sorted(bonusAvgScores.items(), key=operator.itemgetter(1))
	if len(bonusAvgScores) > 0:
		for song in reversed(bonus_sorted_scores):
			songTotal = sum(bonusAllScores[song[0]])
			outputfile.write("# #%d: %s\n---\n**Average:** %.3f **// Total Points:** %.1f **// Controversy:** %.3f **// [Listen here]()**\n\n---\n"% (totalBonusSongs, song[0], float(song[1]), songTotal, findControversy(bonusAllScores[song[0]])))
			totalBonusSongs = totalBonusSongs + 1
			findHighestLowestScores(bonusAllScoresWithNames[song[0]], outputfile, float(song[1]))
			for comment in bonusComments.get(song[0]):
				outputfile.write("%s\n"% (comment))
			outputfile.write("All scores:\n")
			scoreDict = bonusAllScoresWithNames.get(song[0])
			sorted_score_dict = reversed(sorted(scoreDict.items(), key=operator.itemgetter(1)))
			for score in sorted_score_dict:
				if int(score[1]) == float(score[1]):
					outputfile.write("%s %d\n"% (score[0], score[1]))
				else:	
					outputfile.write("%s %.1f\n"% (score[0], score[1]))
			outputfile.write("\n")

	controversies = []
	averages = []

	for song in reversed(sorted_scores):
		cont = findControversy(songAllScores[song[0]])
		controversies.append(cont)
		averages.append(float(song[1]))
		songTotal = sum(songAllScores[song[0]])
		outputfile.write("# #%d: %s\n---\n**Average:** %.3f **// Total Points:** %.1f **// Controversy:** %.3f **// [Listen here]()**\n\n---\n"% (totalSongs, song[0], float(song[1]), songTotal, cont))
		totalSongs = totalSongs + 1
		findHighestLowestScores(songAllScoresWithNames[song[0]], outputfile, float(song[1]))
		for comment in songComments.get(song[0]):
			outputfile.write("%s\n"% (comment))
		outputfile.write("All scores:\n")
		scoreDict = songAllScoresWithNames.get(song[0])
		sorted_score_dict = reversed(sorted(scoreDict.items(), key=operator.itemgetter(1)))
		if numParticipants != len(scoreDict):
				print("Error: wrong number of scores for song %s. Should be %d but is actually %d"% (song[0], numParticipants, len(scoreDict)))
		for score in sorted_score_dict:
			if int(score[1]) == float(score[1]):
				outputfile.write("%s %d\n"% (score[0], score[1]))
			else:	
				outputfile.write("%s %.1f\n"% (score[0], score[1]))
		outputfile.write("\n")

	outputfile.write("Overall album information\n\n")
	for album in albumOverallAverages:
		average = sum(albumOverallAverages[album]) / len(albumOverallAverages[album])
		outputfile.write("Overall average for %s: %.3f\n\n"% (album, average))
		outputfile.write("%s User comments: \n\n"% (album))
		for entry in albumAllComments[album]:
			outputfile.write("%s \n\n"% (entry))
		outputfile.write("\n\n")
		outputfile.write("User averages for %s:\n\n"% (album))
		sorted_album_scores = reversed(sorted(albumUserAverages[album].items(), key=operator.itemgetter(1)))
		for key in sorted_album_scores:
			outputfile.write("%s: %.3f\n"% (key[0], key[1]))
		outputfile.write("\n")

	outputfile.write("List of participants:\n")
	for username in usernames:
		outputfile.write("%s\n"% (username))
	outputfile.write("\n")

	outputfile.write("Number of participants: %d\n\n"% (len(usernames)))
	outputfile.write("Average average: %.4f\n\n"% (sum(averages)/max(1, len(averages))))
	outputfile.write("Controversy average: %.4f\n\n"% (sum(controversies)/max(1, len(controversies))))

	totalBonusSongs = 1
	totalSongs = 1

	if len(bonusAvgScores) > 0:
		outputfile.write("Bonus rank:\n")
		for song in reversed(bonus_sorted_scores):
			if int(song[1]) == float(song[1]):
				outputfile.write("#%d: %s, %d, %.1f\n"% (totalBonusSongs, song[0], int(song[1]), sum(bonusAllScores[song[0]])))
			else:	
				outputfile.write("#%d: %s, %.4f, %.1f\n"% (totalBonusSongs, song[0], float(song[1]), sum(bonusAllScores[song[0]])))
			totalBonusSongs = totalBonusSongs + 1
		outputfile.write("\n")

	outputfile.write("Rank:\n")
	for song in reversed(sorted_scores):
		if int(song[1]) == float(song[1]):
			outputfile.write("\n\#%d: %s, %d, %.1f\n"% (totalSongs, song[0], int(song[1]), sum(songAllScores[song[0]])))
		else:	
			outputfile.write("\n\#%d: %s, %.4f, %.1f\n"% (totalSongs, song[0], float(song[1]), sum(songAllScores[song[0]])))		
		totalSongs = totalSongs + 1

def fix(inputfile, outputfile):
	for line in inputfile:
		line2 = str.replace(line, " ", ": ", 1)
		outputfile.write(line2)

def main():
	if __name__ == '__main__':
		datafile = open("data.txt", "r")
		outputfile = open("output.txt", "w")
		#fix(datafile, outputfile)
		#return
		if (parsevotes(datafile) == 1):
			return
		else:
			print("Parsed votes!")
			printResults(outputfile)
		print("Printed results!")
main()

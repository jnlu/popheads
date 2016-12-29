import operator
import math

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

def parsevotes(datafile):
	gaveZero = False
	gaveEleven = False
	bonus = False
	username = ""
	albumCount = 0
	numParticipants = 0
	albumAllScores = []

	for line in datafile:
		category = line.split(":", 1)
		for word in category:
			word = word.strip('\n')
		categoryFirst = category[0].strip('\n').strip(' ')
		if categoryFirst == "Username":
			if username != "":
				print("Error: The scoresheet for user '%s' did not properly end. Exiting program."% (username))
				return 1
			username = category[1].strip('\n').strip(' ')
			if username in usernames:
				print("Error: The username '%s' appeared twice. Exiting program."% (username))
				return 1
			usernames.append(username)
			numParticipants += 1
		elif categoryFirst == "Album":
			if len(albumAllScores) != 0:
				albumUserAverages[album][username] = (sum(albumAllScores) / albumCount)
			albumAllScores[:] = []
			albumCount = 0
			album = category[1].split(" ", 1)[1].strip('\n')
			if album not in albumOverallAverages:
				albumOverallAverages[album] = []
			if album not in albumUserAverages:
				albumUserAverages[album] = {}
		elif categoryFirst == "END":
			if len(albumAllScores) != 0:
				albumUserAverages[album][username] = (sum(albumAllScores) / albumCount)
			albumAllScores[:] = []
			albumCount = 0
			bonus = False
			gaveZero = False
			gaveEleven = False
			username = ""
		elif categoryFirst == "BONUS TRACKS":
			bonus = True
		else:
			songName = categoryFirst
			if bonus == False:
				songScoreComment = category[1].split(" ", 2)
				songScore = float(songScoreComment[1])
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

				if songName not in songComments:
					songComments[songName] = []
				if songName not in songAvgScores:
					songAvgScores[songName] = 0
				if songName not in songAllScores:
					songAllScores[songName] = []
				if songName not in songAllScoresWithNames:
					songAllScoresWithNames[songName] = {}

				if len(songScoreComment) != 2:
					songComment = songScoreComment[2]
					if (songComment != "\n"):
						songComments.get(songName).append("**%s**: %s"% (username, songComment))

				albumCount += 1
				albumAllScores.append(songScore)

				songAvgScores[songName] = ((songAvgScores.get(songName) * (numParticipants - 1)) + songScore) / numParticipants
				songAllScores[songName].append(songScore)
				songAllScoresWithNames[songName][username] = songScore

			else:
				if songName not in bonusComments:
					bonusComments[songName] = []
				if songName not in bonusAvgScores:
					bonusAvgScores[songName] = 0
				if songName not in bonusAllScores:
					bonusAllScores[songName] = []
				if songName not in bonusAllScoresWithNames:
					bonusAllScoresWithNames[songName] = {}

				if category[1] == "\n":
					continue
				else:
					songScoreComment = category[1].split(" ", 2)
					songScore = float(songScoreComment[1])
					if (songScore == 0):
						print("Error: User '%s' gave a zero to the bonus track '%s'. Exiting program."% (username, songName))
						return 1
					if (songScore == 11):
						print("Error: User '%s' gave an eleven to the bonus track '%s'. Exiting program."% (username, songName))
						return 1
					if (songScore < 1 or songScore > 10):
						print("Error: User '%s' gave an invalid score to track '%s'. Exiting program."% (username, songName))
						return 1
					if len(songScoreComment) != 2:
						songComment = songScoreComment[2]
						if (songComment != "\n"):
							bonusComments.get(songName).append("**%s**: %s"% (username, songComment))

					bonusAvgScores[songName] = ((bonusAvgScores.get(songName) * (numParticipants - 1)) + songScore) / numParticipants
					bonusAllScores[songName].append(songScore)
					bonusAllScoresWithNames[songName][username] = songScore
	return 0

def findControversy(scores):
	num_items = len(scores)
	mean = sum(scores) / num_items
	differences = [x - mean for x in scores]
	sq_differences = [d ** 2 for d in differences]
	ssd = sum(sq_differences)
	return math.sqrt(ssd / num_items)

def findHighestLowestScores(scores, outputfile):
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
		elif (highestScore - song[1]) <= 1:
			if song[1] not in highest:
				highest[song[1]] = []
			highest[song[1]].append(song[0])
		if song[1] == 0:
			if 0 not in lowest:
				lowest[0] = []
			lowest[0].append(song[0])
		elif (song[1] - lowestScore) <= 1:
			if song[1] not in lowest:
				lowest[song[1]] = []
			lowest[song[1]].append(song[0])
	outputfile.write("Highest scores: ")
	for key in reversed(sorted(highest)):
		outputfile.write("(%d x%d) "% (key, len(highest[key])))
		lastusername = highest[key][-1]
		for username in highest[key]:
			outputfile.write("%s"% (username))
			if (username != lastusername):
				outputfile.write(", ")
			else:
				outputfile.write(" ")
	outputfile.write("\n")
	outputfile.write("Lowest scores: ")
	for key in sorted(lowest):
		outputfile.write("(%d x%d) "% (key, len(lowest[key])))
		lastusername = lowest[key][-1]
		for username in lowest[key]:
			outputfile.write("%s"% (username))
			if (username != lastusername):
				outputfile.write(", ")
			else:
				outputfile.write(" ")
	outputfile.write("\n")
	outputfile.write("\n")

def printResults(outputfile):
	totalSongs = 1
	totalBonusSongs = 1
	sorted_scores = sorted(songAvgScores.items(), key=operator.itemgetter(1))
	bonus_sorted_scores = sorted(bonusAvgScores.items(), key=operator.itemgetter(1))

	for song in reversed(bonus_sorted_scores):
		outputfile.write("#%d - %s\nAverage: %f / Controversy: %f\n~~~~~~~~~~~~~~~~~~\n"% (totalBonusSongs, song[0], float(song[1]), findControversy(bonusAllScores[song[0]])))
		totalBonusSongs = totalBonusSongs + 1
		findHighestLowestScores(bonusAllScoresWithNames[song[0]], outputfile)
		for comment in bonusComments.get(song[0]):
			outputfile.write("%s \n"% (comment))
		outputfile.write("All scores:\n")
		scoreDict = bonusAllScoresWithNames.get(song[0])
		sorted_score_dict = reversed(sorted(scoreDict.items(), key=operator.itemgetter(1)))
		for score in sorted_score_dict:
			outputfile.write("%s %d\n"% (score[0], score[1]))
		outputfile.write("\n")

	for song in reversed(sorted_scores):
		outputfile.write("#%d - %s\nAverage: %f / Controversy: %f\n~~~~~~~~~~~~~~~~~~\n"% (totalSongs, song[0], float(song[1]), findControversy(songAllScores[song[0]])))
		totalSongs = totalSongs + 1
		findHighestLowestScores(songAllScoresWithNames[song[0]], outputfile)
		for comment in songComments.get(song[0]):
			outputfile.write("%s \n"% (comment))
		outputfile.write("All scores:\n")
		scoreDict = songAllScoresWithNames.get(song[0])
		sorted_score_dict = reversed(sorted(scoreDict.items(), key=operator.itemgetter(1)))
		for score in sorted_score_dict:
			outputfile.write("%s %d\n"% (score[0], score[1]))
		outputfile.write("\n")

	outputfile.write("Overall album averages:\n")
	for album in albumOverallAverages:
		average = sum(albumOverallAverages[album]) / len(albumOverallAverages[album])
		outputfile.write("%s: %f\n"% (album, average))
	outputfile.write("\n")

	outputfile.write("User album averages:\n\n")
	for key in albumUserAverages:
		outputfile.write("%s averages:\n"%(key))
		sorted_album_scores = reversed(sorted(albumUserAverages[key].items(), key=operator.itemgetter(1)))
		for otherkey in sorted_album_scores:
			outputfile.write("%s: %f\n"% (otherkey[0], otherkey[1]))
		outputfile.write("\n")

	outputfile.write("List of participants:\n")
	for username in usernames:
		outputfile.write("%s\n"% (username))
	outputfile.write("\n")

	totalBonusSongs = 1
	totalSongs = 1

	outputfile.write("Bonus rank:\n")
	for song in reversed(bonus_sorted_scores):
		outputfile.write("#%d: %s, %f\n"% (totalBonusSongs, song[0], float(song[1])))
		totalBonusSongs = totalBonusSongs + 1
	outputfile.write("\n")

	outputfile.write("Rank:\n")
	for song in reversed(sorted_scores):
		outputfile.write("#%d: %s, %f\n"% (totalSongs, song[0], float(song[1])))
		totalSongs = totalSongs + 1


def main():
	if __name__ == '__main__':
		datafile = open("data.txt", "r")
		outputfile = open("output.txt", "w")

		if (parsevotes(datafile) == 1):
			return
		else:
			print("Parsed votes!")
			printResults(outputfile)
		print("Printed results!")
main()

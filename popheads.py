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
	albumAllScores = []

	for line in datafile:
		category = line.split(":", 1)
		if category and all(elem == '\n' for elem in category):
			continue
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
		elif categoryFirst == "Album":
			if len(albumAllScores) != 0:
				albumUserAverages[album][username] = (sum(albumAllScores) / max(1, len(albumAllScores)))
			albumAllScores[:] = []
			album = category[1].split(" ", 1)[1].strip('\n')
			if album not in albumOverallAverages:
				albumOverallAverages[album] = []
			if album not in albumUserAverages:
				albumUserAverages[album] = {}
		elif categoryFirst == "END":
			#print("Added %s!"% (username))
			if len(albumAllScores) != 0:
				albumUserAverages[album][username] = (sum(albumAllScores) / max(1, len(albumAllScores)))
			albumAllScores[:] = []
			bonus = False
			gaveZero = False
			gaveEleven = False
			username = ""
		elif categoryFirst == "BONUS TRACKS":
			bonus = True
		else:
			songName = categoryFirst
			#print("On %s" %(songName))
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
					songComment = songScoreComment[2].strip(' ').strip('\n').replace('\"','\'').strip(' ')
					if (songComment != "\n" and songComment != " \n" and songComment != ""):
						songComments.get(songName).append("**%s**: \"%s\"\n"% (username, songComment))
				albumAllScores.append(songScore)

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
						songComment = songScoreComment[2].strip(' ').strip('\n')
						if (songComment != "\n" and songComment != " \n" and songComment != ""):
							bonusComments.get(songName).append("**%s**: \"%s\"\n"% (username, songComment))

					bonusAllScores[songName].append(songScore)
					bonusAllScoresWithNames[songName][username] = songScore

	for song in songAvgScores:
		songAvgScores[song] = float(sum(songAllScores[song]) / max(len(songAllScores[song]), 1))
	for song in bonusAvgScores:
		bonusAvgScores[song] = float(sum(bonusAllScores[song]) / max(len(bonusAllScores[song]), 1))
	return 0

def findControversy(scores):
	num_items = len(scores)
	mean = sum(scores) / num_items
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
		elif (highestScore - song[1]) < 2 and (song[1] > average):
			if song[1] not in highest:
				highest[song[1]] = []
			highest[song[1]].append(song[0])
		if song[1] == 0:
			if 0 not in lowest:
				lowest[0] = []
			lowest[0].append(song[0])
		elif (song[1] - lowestScore) < 2 and (song[1] < average):
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
	outputfile.write("\n\n[All scores]()\n\n---\n")

def printResults(outputfile):
	numParticipants = len(usernames)
	totalSongs = 1
	totalBonusSongs = 1
	sorted_scores = sorted(songAvgScores.items(), key=operator.itemgetter(1))
	bonus_sorted_scores = sorted(bonusAvgScores.items(), key=operator.itemgetter(1))

	for song in reversed(bonus_sorted_scores):
		outputfile.write("# #%d: %s\n**Average:** %.3f // Controversy: %.3f // [Listen here]()\n\n---\n"% (totalBonusSongs, song[0], float(song[1]), findControversy(bonusAllScores[song[0]])))
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
		outputfile.write("# #%d: %s\n---\n**Average:** %.3f // **Controversy:** %.3f // [Listen here]()\n\n---\n"% (totalSongs, song[0], float(song[1]), cont))
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

	outputfile.write("Overall album averages:\n")
	for album in albumOverallAverages:
		average = sum(albumOverallAverages[album]) / len(albumOverallAverages[album])
		outputfile.write("%s: %.3f\n"% (album, average))
	outputfile.write("\n")

	outputfile.write("User album averages:\n\n")
	for key in albumUserAverages:
		outputfile.write("%s averages:\n"%(key))
		sorted_album_scores = reversed(sorted(albumUserAverages[key].items(), key=operator.itemgetter(1)))
		for otherkey in sorted_album_scores:
			outputfile.write("%s: %.3f\n"% (otherkey[0], otherkey[1]))
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

	outputfile.write("Bonus rank:\n")
	for song in reversed(bonus_sorted_scores):
		if int(song[1]) == float(song[1]):
			outputfile.write("#%d: %s, %d\n"% (totalBonusSongs, song[0], int(song[1])))
		else:	
			outputfile.write("#%d: %s, %.2f\n"% (totalBonusSongs, song[0], float(song[1])))
		totalBonusSongs = totalBonusSongs + 1
	outputfile.write("\n")

	outputfile.write("Rank:\n")
	for song in reversed(sorted_scores):
		if int(song[1]) == float(song[1]):
			outputfile.write("#%d: %s, %d, %.1f\n"% (totalSongs, song[0], int(song[1]), float(song[1] * numParticipants)))
		else:	
			outputfile.write("#%d: %s, %.4f, %.1f\n"% (totalSongs, song[0], float(song[1]), float(song[1] * numParticipants)))		
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

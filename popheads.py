#!/usr/bin/env python
# -*- coding: utf-8 -*-
import operator
import math
import re
import time
import csv
import sys

class RateMachine:

	def __init__(self):
		self.usernames = [] #This list holds all of the usernames
		self.songs = [] #This list holds all of the songs in order
		self.bonusSongs = [] #This list holds all of the bonus songs in order
		self.albums = [] #This list holds all of the albums in order

		self.songComments = {} #This dictionary's keys are the song titles, and the values are lists of tuples that have the username, score, and comment
		self.songAvgScores = {} #This dictionary's keys are the song titles, and the values are the current average
		self.songAllScores = {} #This dictionary's keys are the song titles, and the values are the lists that contain just the scores
		self.songAllScoresWithNames = {} #This dictionary's keys are the song titles, and the values are another dictionary that contain a username and a score
		self.songAllControversies = {} #keys are titles, values are cont scores

		self.bonusComments = {}
		self.bonusAvgScores = {}
		self.bonusAllScores = {}
		self.bonusAllScoresWithNames = {}

		self.albumOverallAverages = {} #This dictionary's keys are album titles, and the values are a list with every single score it received
		self.albumUserAverages = {} #This dictionary's keys are the album titles, and the values are another dictionary that contain a username and an average
		self.albumAllComments = {} #This dictionary's keys are the album titles, and the values are a list that contain a username and comment

		self.hostSongComments = {} #This dictionary's keys are song titles, and the values are the host's comment on a song.
		self.hostAlbumComments = {} #This dictionary's keys are album titles, and the values are the host's comment on a song.
		self.hostAllScoresLinks = {} #This dictionary's keys are song titles, and the values are the links to a pastebin that shows everyone's scores for a song
		self.hostAllListenHereLinks = {} #This dictionary's keys are song titles, and the values are the links to a pastebin that shows everyone's scores for a song
		self.hostAllSongImages = {} #Keys are song names, values are image links
		self.hosts = [] #List of host names

		self.songArtistMap = {} #Keys are song names, values are artist names
		self.userAllScores = {} #Keys are usernames, values are lists that contain all of the scores they gave

		self.hasAlbums = True
		self.category = "Album"


	def recordSong(self, line, host, artist, album, username, gaveZero, gaveEleven):

		"""
		Takes a line and records the song name, the score, and an optional comment.

		Input: line - a string
		Output: the song title

		"""

		songScore = 200
		regexSong = r"(.+?):\s*([\d\.\/10]+)?\s*(.+)?"

		songScoreComment = re.findall(regexSong, line)[0]
		songName = songScoreComment[0].strip('\n').strip()

		if host:
			if songName not in self.songs:
				self.songs.append(songName)
			if songName not in self.songComments:
				self.songComments[songName] = []
			if songName not in self.songAvgScores:
				self.songAvgScores[songName] = 0
			if songName not in self.songAllScores:
				self.songAllScores[songName] = []
			if songName not in self.songAllScoresWithNames:
				self.songAllScoresWithNames[songName] = {}
			if artist != "":
				self.songArtistMap[songName] = artist

		if not host:
			if songName not in self.songs:
				print("User %s gave a score for a song not included. Triggered for song '%s'. Exiting program."% (username, songName))
				sys.exit()			

		if len(songScoreComment) > 1:
			if songScoreComment[1]:
				songScore = float(songScoreComment[1].strip('\n').strip().replace("/10",''))
			if len(songScoreComment) == 3:
				if songScoreComment[2]:
					songComment = songScoreComment[2].strip('\n').strip().replace("(n)", "\n\n")
					if not host:
						self.songComments[songName].append((username, songScore, songComment))
					else:
						if songName not in self.hostSongComments:
							self.hostSongComments[songName] = []
						self.hostSongComments[songName].append((username, songScore, songScoreComment[2].strip('\n').strip().replace("(n)", "\n\n")))
		
		#if songScore % 0.5 != 0:
			#print("User %s gave an ugly score of %s to song %s."% (username, songScore, songName))
		if (songScore == 200):
			print("Error: User '%s' did not give a score to track '%s'. Exiting program."% (username, songName))
			sys.exit()
		if ((songScore < 1 and songScore != 0) or (songScore > 10 and songScore != 11)):
			print("Error: User '%s' gave an invalid score to track '%s'. Exiting program."% (username, songName))
			sys.exit()
		if songScore == 0 and gaveZero:
			print("Error: User '%s' gave two 0s. Triggered for song '%s'. Exiting program."% (username, songName))
			sys.exit()
		if songScore == 11 and gaveEleven:
			print("Error: User '%s' gave two 11s. Triggered for song '%s'. Exiting program."% (username, songName))
			sys.exit()

		if self.hasAlbums:
			self.albumOverallAverages[album].append(songScore)
		self.songAllScores[songName].append(songScore)
		self.songAllScoresWithNames[songName][username] = songScore
		self.userAllScores[username].append(songScore)
		return(songScore)

	def recordBonusSong(self, line, host, artist, album, username):

		"""
		Takes a line and records the bonus song name, the score, and an optional comment.

		Input: line - a string
		Output: the song title

		"""
		songScore = 200
		regexSong = r"(.+?):\s*([\d\.\/10]+)?\s*(.+)?"

		songScoreComment = re.findall(regexSong, line)[0]
		songName = songScoreComment[0].strip('\n').strip()

		if len(songScoreComment) > 1:
			if songScoreComment[1]:
				songScore = float(songScoreComment[1].strip('\n').strip())

		if host:
			if songName not in self.bonusComments:
				self.bonusComments[songName] = []
			if songName not in self.bonusAvgScores:
				self.bonusAvgScores[songName] = 0
			if songName not in self.bonusAllScores:
				self.bonusAllScores[songName] = []
			if songName not in self.bonusAllScoresWithNames:
				self.bonusAllScoresWithNames[songName] = {}
			if songName not in self.bonusSongs:
				self.bonusSongs.append(songName)
			if artist != "":
				self.songArtistMap[songName] = artist


		if not host:
			if songName not in self.bonusSongs:
				print("User %s gave a score for a song not included. Triggered for song '%s'. Exiting program"% (username, songName))
				sys.exit()

		if songScore != 200:
			if (songScore == 0):
				print("Error: User '%s' gave a zero to the bonus track '%s'. Exiting program."% (username, songName))
				sys.exit()
			if (songScore == 11):
				print("Error: User '%s' gave an eleven to the bonus track '%s'. Exiting program."% (username, songName))
				sys.exit()
			if (songScore < 1 or songScore > 10):
				print("Error: User '%s' gave an invalid score %i to track '%s'. Exiting program."% (username, songScore, songName))
				sys.exit()

			if len(songScoreComment) == 3:
				if songScoreComment[2]:
					songComment = songScoreComment[2].strip('\n').strip()
					if not host:
						self.bonusComments[songName].append((username, songScore, songComment))
					else:
						if songName not in self.hostSongComments:
							self.hostSongComments[songName] = []
						self.hostSongComments[songName].append((username, songScore, songScoreComment[2].strip('\n').strip().replace("(n)", "\n\n")))
			self.bonusAllScores[songName].append(songScore)
			self.bonusAllScoresWithNames[songName][username] = songScore

	def recordUsername(self, line):

		"""
		Takes a username line and saves the username.

		Input: line - a string
		Output: the username
		"""

		regexUsername = r"Username:\s*(.+)"
		username = re.findall(regexUsername, line)[0]
		if username in self.usernames:
			print("Error: The username '%s' appeared twice. Exiting program."% (username))
			sys.exit()
		self.usernames.append(username)
		self.userAllScores[username] = []
		return(username)

	def recordAlbum(self, line, albumAllScores, host, album, username):

		"""
		Takes a line with an album, saves the title, and calculates averages.


		Input: line - a string, albumAllScores - a temporary list with scores for an album, host - the host boolean
		Output: the album title
		"""
		regexAlbum = re.escape(self.category) + r":\s*([^:]+):?\s*(.+)?"

		if len(albumAllScores) != 0:
			self.albumUserAverages[album][username] = (sum(albumAllScores) / max(1, len(albumAllScores)))
		albumAndComment = re.findall(regexAlbum, line)[0]
		album = albumAndComment[0].strip('\n').strip()

		if len(albumAndComment) > 1:
			if album not in self.albumAllComments:
				self.albumAllComments[album] = []
			albumComment = albumAndComment[1].strip('\n').strip()
			if albumComment:
				if host:
					if album not in self.hostAlbumComments:
						self.hostAlbumComments[album] = []
					self.hostAlbumComments[album].append((username, albumAndComment[1].strip('\n').strip()))
				else:
					self.albumAllComments[album].append((username, albumComment))
		
		if host:
			if album not in self.albumOverallAverages:
				self.albumOverallAverages[album] = []
			if album not in self.albumUserAverages:
				self.albumUserAverages[album] = {}
			if album not in self.albums:
				self.albums.append(album)
		return(album)

	def parsevotes(self, datafile, setting):
		"""
		Parses through a data file and does all of the score gathering. Uses the above dictionaries to store all of the information.

		Input: 	datafile - a text file formatted properly
				setting - a setting integer representing how scores should work. Mostly affects 0s/11s.
		Output: none

		"""

		gaveZero = False
		gaveEleven = False
		bonus = False
		host = False
		username = ""
		artist = ""
		albumAllScores = []

		regexSong = r"(.+?):\s*([\d\.\/10]+)?\s*(.+)?"
		regexAllScores = r"AS:\s*(.+)"
		regexListenHere = r"LH:\s*(.+)"
		regexArtist = r"ARTIST:\s*(.+)"
		regexImage = r"IMAGE:\s*(.+)"
		regexCategory = r"CATEGORY:\s*(.+)"
		album = ""

		for line in datafile:
			#print(line)
			if not line.isspace():
				line = line.strip('\n').strip()
				if line.startswith("Username"):
					if username != "":
						print("Error: The username '%s' did not end properly. Exiting program."% (username))
						sys.exit()
					else:
						username = self.recordUsername(line)
				elif line.startswith("HOST"):
					host = True
					if username not in self.hosts:
						self.hosts.append(username)
				elif line.startswith("NO ALBUM"):
					if host:
						self.hasAlbums = False
				elif line.startswith("CATEGORY"):
					if host:
						self.category = re.findall(regexCategory, line)[0]
				elif line.startswith("ARTIST"):
					if host:
						artist = re.findall(regexArtist, line)[0]
				elif line.startswith("AS"):
					if host:
						self.hostAllScoresLinks[songName] = re.findall(regexAllScores, line)[0]
				elif line.startswith("LH"):
					if host:
						self.hostAllListenHereLinks[songName] = re.findall(regexListenHere, line)[0]
				elif line.startswith("IMAGE"):
					if host:
						self.hostAllSongImages[songName] = re.findall(regexImage, line)[0]
				elif line.startswith(self.category):
					if self.hasAlbums:
						album = self.recordAlbum(line, albumAllScores, host, album, username)
						albumAllScores[:] = []
						bonus = False

				elif line.startswith("END"):
					#print("Added %s!"% (username))
					if len(albumAllScores) != 0:
						if self.hasAlbums:
							self.albumUserAverages[album][username] = (sum(albumAllScores) / max(1, len(albumAllScores)))
					albumAllScores[:] = []
					bonus = False
					gaveZero = False
					gaveEleven = False
					host = False
					username = ""
					artist = ""

				elif line.startswith("BONUS TRACKS"):
					bonus = True
					artist = ""
				else:
					songScore = 200
					songScoreComment = re.findall(regexSong, line)[0]
					songName = songScoreComment[0].strip('\n').strip()
					if bonus:
						score = self.recordBonusSong(line, host, artist, album, username)
					else:
						score = self.recordSong(line, host, artist, album, username, gaveZero, gaveEleven)
						if score == 11:
							gaveEleven = True
						elif score == 0:
							gaveZero = True
						albumAllScores.append(score)

		for song in self.songAvgScores:
			self.songAvgScores[song] = float(sum(self.songAllScores[song]) / max(len(self.songAllScores[song]), 1))
		for song in self.bonusAvgScores:
			self.bonusAvgScores[song] = float(sum(self.bonusAllScores[song]) / max(len(self.bonusAllScores[song]), 1))

	def findControversy(self, scores):
		num_items = len(scores)
		mean = sum(scores) / max(1, num_items)
		differences = [x - mean for x in scores]
		sq_differences = [d ** 2 for d in differences]
		ssd = sum(sq_differences)
		return math.sqrt(ssd / num_items)

	def findHighestLowestScores(self, scores, outputfile, average):
		highest = {}
		lowest = {}
		highestScore = -20
		lowestScore = 20
		sorted_scores = sorted(scores.items(), key=operator.itemgetter(1))
		for song in sorted_scores:
			score = song[1]
			username = song[0]
			if score > highestScore and score != 11:
				highestScore = score
			if score < lowestScore and score != 0:
				lowestScore = score
		for song in sorted_scores:
			score = song[1]
			username = song[0]
			if score == 11:
				if 11 not in highest:
					highest[11] = []
				highest[11].append(username)
			elif (highestScore - score) < 2 and (score - 0.5 > average):
				if score not in highest:
					highest[score] = []
				highest[score].append(username)
			if score == 0:
				if 0 not in lowest:
					lowest[0] = []
				lowest[0].append(username)
			elif (score - lowestScore) < 2 and (score + 0.5 < average):
				if score not in lowest:
					lowest[score] = []
				lowest[score].append(username)
		outputfile.write("**Highest scores:** ")
		for key in reversed(sorted(highest)):
			if int(key) == float(key):
				outputfile.write("(%d x%d) "% (key, len(highest[key])))
			else:
				outputfile.write("(%.1f x%d) "% (key, len(highest[key])))
			lastusername = sorted(highest[key], key=str.lower)[-1]
			for username in sorted(highest[key], key=str.lower):
				outputfile.write(username.replace("_", "\_"))
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
			lastusername = sorted(lowest[key], key=str.lower)[-1]
			for username in sorted(lowest[key], key=str.lower):
				outputfile.write(username.replace("_", "\_"))
				if (username != lastusername):
					outputfile.write(", ")
				else:
					outputfile.write(" ")
		outputfile.write("\n\n")

	def printResults(self, outputfile):
		numParticipants = len(self.usernames)
		totalSongs = 1
		totalBonusSongs = 1
		sorted_scores = sorted(self.songAvgScores.items(), key=operator.itemgetter(1))
		temp_rank = enumerate(reversed(sorted_scores), 1)
		song_rank = {}
		count = 0
		rank = 0
		prev = None
		for song in temp_rank:
			count += 1
			num = song[1][1]
			if num != prev:
				rank += count
				prev = num
				count = 0
			song_rank[song[0]] = (rank, song[1])
		bonus_sorted_scores = sorted(self.bonusAvgScores.items(), key=operator.itemgetter(1))
		mul_hosts = False
		if len(self.hosts) > 1:
			mul_hosts = True

		if len(self.bonusAvgScores) > 0:
			for song in reversed(bonus_sorted_scores):
				songTitle = song[0]
				songTotal = sum(self.bonusAllScores[songTitle])
				main_title = songTitle
				if songTitle in self.songArtistMap:
					main_title = self.songArtistMap[songTitle] + " - " + songTitle
				if songTitle in self.hostAllSongImages:
					main_title = "[" + main_title + "](" + self.hostAllSongImages[songTitle] + ")"
				outputfile.write("# Bonus #%d: %s\n---\n**Average:** %.3f **// Total Points:** %.1f **// Controversy:** %.3f"% (totalBonusSongs, main_title, float(song[1]), songTotal, self.findControversy(self.bonusAllScores[songTitle])))
				if (songTitle in self.hostAllListenHereLinks):
					outputfile.write(" **// [Listen here](" + self.hostAllListenHereLinks[songTitle] + ")**")
				outputfile.write("\n\n---\n")
				totalBonusSongs = totalBonusSongs + 1
				self.findHighestLowestScores(self.bonusAllScoresWithNames[songTitle], outputfile, float(song[1]))
				if (songTitle in self.hostAllScoresLinks):
					outputfile.write("[All scores](" + self.hostAllScoresLinks[songTitle] + ")\n\n")
				outputfile.write("---\n\n")
				if songTitle in self.hostSongComments:
					if mul_hosts:
						for tup in self.hostSongComments[songTitle]:
							if int(tup[1]) == float(tup[1]):
								outputfile.write("**%s** (%s): %s\n\n"% (tup[0].replace("_", "\_"), int(tup[1]), tup[2]))
							else:
								outputfile.write("**%s** (%s): %s\n\n"% (tup[0].replace("_", "\_"), float(tup[1]), tup[2]))
						outputfile.write("---\n")
					else:
						outputfile.write("%s\n\n---\n"% (self.hostSongComments[songTitle][2]))
				sortedComments = sorted(self.bonusComments[songTitle], key=lambda tup:(-tup[1], (tup[0].lower())))
				for comment in sortedComments:
					if int(comment[1]) == float(comment[1]):
						outputfile.write("**%s** (%s): %s\n\n"% (comment[0].replace("_", "\_"), int(comment[1]), comment[2]))
					else:
						outputfile.write("**%s** (%s): %s\n\n"% (comment[0].replace("_", "\_"), float(comment[1]), comment[2]))
				outputfile.write("All scores:\n")
				scoreDict = self.bonusAllScoresWithNames.get(songTitle)
				sorted_score_dict = reversed(sorted(scoreDict.items(), key=operator.itemgetter(1)))
				for score in sorted_score_dict:
					if int(score[1]) == float(score[1]):
						outputfile.write("%s %d\n"% (score[0], score[1]))
					else:	
						outputfile.write("%s %.1f\n"% (score[0], score[1]))
				outputfile.write("\n")

		controversies = []
		averages = []
		for k in song_rank:
			songTitle = song_rank[k][1][0]
			songScore = song_rank[k][1][1]
			rank = song_rank[k][0]
			cont = self.findControversy(self.songAllScores[songTitle])
			self.songAllControversies[songTitle] = cont
			controversies.append(cont)
			averages.append(float(songScore))
			songTotal = sum(self.songAllScores[songTitle])
			main_title = songTitle
			if songTitle in self.songArtistMap:
				main_title = self.songArtistMap[songTitle] + " - " + songTitle
			if songTitle in self.hostAllSongImages:
				main_title = "[" + main_title + "](" + self.hostAllSongImages[songTitle] + ")"
			outputfile.write("# #%d: %s\n---\n**Average:** %.3f **// Total Points:** %.1f **// Controversy:** %.3f"% (rank, main_title, float(songScore), songTotal, cont))
			if (songTitle in self.hostAllListenHereLinks):
				outputfile.write(" **// [Listen here](" + self.hostAllListenHereLinks[songTitle] + ")**")
			outputfile.write("\n\n---\n")
			self.findHighestLowestScores(self.songAllScoresWithNames[songTitle], outputfile, float(songScore))
			if (songTitle in self.hostAllScoresLinks):
				outputfile.write("[All scores](" + self.hostAllScoresLinks[songTitle] + ")\n\n")
			outputfile.write("---\n")
			if songTitle in self.hostSongComments:
				if mul_hosts:
					for tup in self.hostSongComments[songTitle]:
						if int(tup[1]) == float(tup[1]):
							outputfile.write("**%s** (%s): %s\n\n"% (tup[0].replace("_", "\_"), int(tup[1]), tup[2]))
						else:
							outputfile.write("**%s** (%s): %s\n\n"% (tup[0].replace("_", "\_"), float(tup[1]), tup[2]))
					outputfile.write("---\n")
				else:
					outputfile.write("%s\n\n---\n"% (self.hostSongComments[songTitle][2]))
			sortedComments = sorted(self.songComments[songTitle], key=lambda tup:(-tup[1], (tup[0].lower())))
			for comment in sortedComments:
				if int(comment[1]) == float(comment[1]):
					outputfile.write("**%s** (%s): %s\n\n"% (comment[0].replace("_", "\_"), int(comment[1]), comment[2]))
				else:
					outputfile.write("**%s** (%s): %s\n\n"% (comment[0].replace("_", "\_"), float(comment[1]), comment[2]))
			outputfile.write("\n---\nAll scores:\n\n")
			scoreDict = self.songAllScoresWithNames[songTitle]
			sorted_score_dict = sorted(scoreDict.items(), key= lambda x:(-x[1], x[0].lower()))
			if numParticipants != len(scoreDict):
				print("Error: wrong number of scores for song %s. Should be %d but is actually %d"% (songTitle, numParticipants, len(scoreDict)))
			for score in sorted_score_dict:
				if int(score[1]) == float(score[1]):
					outputfile.write("%s %d\n"% (score[0], score[1]))
				else:	
					outputfile.write("%s %.1f\n"% (score[0], score[1]))
			outputfile.write("\n")

		if self.hasAlbums:
			outputfile.write("Overall " + self.category + " information\n\n")
			for album in self.albumOverallAverages:
				outputfile.write("# " + album + "\n\n---\n\n")
				average = sum(self.albumOverallAverages[album]) / len(self.albumOverallAverages[album])
				outputfile.write("**Overall average**: %.3f **// Total points:** %.3f \n\n---\n\n"% (average, float(average * len(self.usernames))))
				
				if album in self.hostAlbumComments:
					if mul_hosts:
						for tup in self.hostAlbumComments[album]:
							outputfile.write("**%s** (%s): %s\n\n"% (tup[0].replace("_", "\_"), self.albumUserAverages[album][tup[0]], tup[1]))
						outputfile.write("---\n")
					else:
						outputfile.write(self.hostAlbumComments[album] + "\n\n---\n")
				sorted_album_comments = reversed(sorted(self.albumAllComments[album], key=lambda k: self.albumUserAverages[album][k[0]]))
				for entry in sorted_album_comments:
					username = entry[0]
					comment = entry[1]
					outputfile.write("**%s** (%.3f): %s \n\n"% (username.replace("\_", "_"), self.albumUserAverages[album][username], comment))
				outputfile.write("---\n\n")
				outputfile.write("User Averages:\n\n")
				sorted_album_scores = reversed(sorted(self.albumUserAverages[album].items(), key=operator.itemgetter(1)))
				for key in sorted_album_scores:
					outputfile.write("%s: %.3f\n"% (key[0], key[1]))
					if key[1] < 3.75:
						print("User %s gave a low average to album %s"% (key[0], album))
				outputfile.write("\n\n---\n\n")

		outputfile.write("Number of participants: %d\n\n"% (len(self.usernames)))
		outputfile.write("Average average: %.4f\n\n"% (sum(averages)/max(1, len(averages))))
		outputfile.write("Controversy average: %.4f\n\n"% (sum(controversies)/max(1, len(controversies))))

		outputfile.write("List of participants:\n")
		sorted_usernames = sorted(self.usernames, key=lambda x:x.lower())
		for username in sorted_usernames:
			outputfile.write("/u/%s\n"% (username.replace("\_", "_")))
		outputfile.write("\n")

		outputfile.write("Participant overall averages:\n")
		for username in self.usernames:
			self.userAllScores[username] = sum(self.userAllScores[username]) / len(self.userAllScores[username])
		sorted_user_averages = reversed(sorted(self.userAllScores.items(), key=operator.itemgetter(1)))
		for key in sorted_user_averages:
			outputfile.write("%s: %.3f\n"% (key[0].replace("\_", "_"), key[1]))
		outputfile.write("\n")

		totalBonusSongs = 1
		totalSongs = 1


		if len(self.bonusAvgScores) > 0:
			outputfile.write("Bonus rank:\n")
			for song in reversed(bonus_sorted_scores):
				songTitle = song[0]
				main_title = songTitle
				if songTitle in self.songArtistMap:
					main_title = self.songArtistMap[songTitle] + " - " + songTitle
				if self.bonusAllScores[song[0]]:
					outputfile.write("\n\#%d: %s — %s | %.4f | %.1f\n"% (totalBonusSongs, main_title, song[0], float(song[1]), sum(self.bonusAllScores[song[0]])))
				else:		
					outputfile.write("\n\#%d: %s | %.4f | %.1f\n"% (totalBonusSongs, song[0], float(song[1]), sum(self.bonusAllScores[song[0]])))				
				totalBonusSongs += 1
			outputfile.write("\n")

		outputfile.write("Rank:\n")
		for k in song_rank:
			songTitle = song_rank[k][1][0]
			songScore = song_rank[k][1][1]
			rank = song_rank[k][0]
			if songTitle in self.songArtistMap:
				outputfile.write("\n\#%d: %s — %s | %.4f | %.1f\n"% (rank, self.songArtistMap[songTitle], songTitle, float(songScore), sum(self.songAllScores[songTitle])))
			else:		
				outputfile.write("\n\#%d: %s | %.4f | %.1f\n"% (rank, songTitle, float(songScore), sum(self.songAllScores[songTitle])))				
			totalSongs += 1
			
def main():
	if __name__ == '__main__':
		datafile = open(<data_file>, "r")
		outputfile = open(<output_file>, "w")
		rm = RateMachine()
		rm.parsevotes(datafile, 0)
		rm.printResults(outputfile)
		print("Printed results!")
		datafile.close()
		outputfile.close()
main()

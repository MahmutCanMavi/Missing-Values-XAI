# Missing Data Explorer - Visualize & Impute Missing Data

## Team Members
1. Yan Hao
2. Talu Karagöz
3. David Metzger
4. Michael Zellinger

## Project Goals
We are developing an interactive interface for visualizing and imputing missing values. This interface allows the user to group similar features together and impute them. We offer a choice of several different imputation methods. After imputation, our app visualizes the imputation error.

### Users
Our target user group consists of data analysts who deal with missing data in their work.

### Datasets
We use medical data from patients in the intensive care unit. Our current data file is a sample from the HiRiD database of ICU records.

### Tasks
Our interface solves many tasks, including the following:
  - visualize patterns of missing data
  - allow the user to group together features with similar missing data patterns
  - impute missing data 
  - allow user to specify different imputation method for each group of features
  - compute and visualize imputation error

## Design Vision

We aim to implement a three-tab layout with a navigation bar **`[ Visualize | Group | Impute ]`**. 

On the **`[ Visualize ]` tab**, the user uploads data and studies the patterns of missing values for different features. To accomplish this purpose, we developed a visualization called "missing value gradient." These gradients consist of thin rectangles colored in grayscale. The coloring of each rectangle corresponds to the percentage of missing values for a specific patient. Ordering these grayscale rectangles results in a gradient from black to white. The thicker the dark part of the gradient, the more patients with many missing values. Conversely, the thicker the light part, the more patients with very few missing values.

On the **`[ Group ]` tab**, the user defines groups of variables with similar missing value patterns. For example, all the laboratory test results could be part of the same group, and likewise for all the drug treatment variables. Specifying groups is important because it allows the user to select a different imputation method for each group of features. We give the user two choices for grouping variables together: 1) manual grouping based on domain knowledge or trial and error, and 2) automatic grouping based on clustering methods. We have already implemented clustering logic in the backend, but in the current version of our code, this implementation is not connected with the frontend.

On the **`[ Impute ]` tab**, the user specifies an imputation method for each group of variables. It is also on this tab that the user visualizes the error of the imputation. To estimate the imputation error, we artificially remove some existing data and assess how well our imputation methods perform.

Up until this moment, we have made tremendous strides to implement our overall plan. But: **the best is yet to come!**

- - -
## Folder Structure
Specify here the structure of you code and comment what the most important files contain

``` bash
├── README.md  
├── backend-project
│   ├── app.py   # main app
│   ├── ...
├── react-frontend
│   ├── src
│   │   ├── App.tsx   # top-level component for frontend
│   │   ├── components/
│   │   ├── ...
└── requirements.txt
```

## Requirements
<!-- Write here all intructions to build the environment and run your code.\
**NOTE:** If we cannot run your code following these requirements we will not be able to evaluate it. -->
Please make sure your system satisfies all the requirements in the `requirements.txt` file (standard format).

## How to Run
<!-- Write here **DETAILED** intructions on how to run your code.\
**NOTE:** If we cannot run your code following these instructions we will not be able to evaluate it. -->

Run **backend**: go inside the folder `./backend-project`, then enter the command `uvicorn app:app --reload`.

Run **frontend**: go inside the folder `./react-frontend`, then enter the command `npm start`.
 

#### Once it's running...
###### (_For a quick overview, check out our demo video under release notes for the most recent tag!_)

Choose a .csv file from within the folder `./example-data`. These files all contain the same data, but the variables names differ. In this way, you can see that the data changes when you upload a new file, as it should. 

After the data is loaded, you can play around with our visualization. The gradients on the left visualize the percentage of missing data per patient. Each gradient is made up of thin rectangles colored in grayscale. The brightness of each rectangle represents the percentage of missing data for a specific patient. These rectangles are ordered by their brightness. Thus, a gradient with mostly dark rectangles represents lots of missing data, and a gradient with mostly bright rectangles indicates little missing data. 

Each gradient refers to one of the features in the data set. Clicking on a gradient reveals, for the chosen feature, the distribution of the percentage of missing values over all patients in the data set. We visualize this distribution as a histogram.

_You're looking at the beginnings of a very special tool for visualizing and imputing missing values. Savor the moment!_


## Milestones
Major milestones of our code + future planned steps.\

- [x] Week 21.04.2022 
  - [x] Manage interaction between Missing Value Gradients and Histogram: clicking on a gradient shows the corresponding histogram
  - [x] Allow the user to upload their own data
  - [x] Put in place an aesthetically pleasing three-tab layout
  - [x] Implemented [ Visualize ] tab
  - [x] Develop workaround for bug in uvicorn/fastapi when uploading files

- [ ] Week 05.05.2022
  - [ ] Fill the group page with some content

- [ ] At some point  
  - [ ] choose groups of features automatically or manually
  - [ ] add different imputation algorithms and display them on the imputation page

<!-- Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details.  -->
<!-- 
This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.   -->

<!-- ## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.

Tags:
- Week 1: [Week 1 Tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/tags/stable-readme)
- Week 2: ..
- Week 3: ..
- ... -->


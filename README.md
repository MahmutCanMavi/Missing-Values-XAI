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

- - -
## Folder Structure
Specify here the structure of you code and comment what the most important files contain

``` bash
├── README.md  
├── backend-project
│   ├── app.py   # main app
│   ├── data
│   │   ├── dataset_blobs.csv
│   │   ├── dataset_circles.csv
│   │   ├── dataset_moons.csv
│   │   └── generate_data.py    # script to create data
│   └── pydantic_models
│       └── example_data_points.py
├── react-frontend
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── Visualization.tsx
│   │   ├── backend
│   │   │   ├── BackendQueryEngine.tsx
│   │   │   └── json-decoder.ts
│   │   ├── components
│   │   │   ├── BasicLineChart
│   │   │   │   ├── BasicLineChart.scss
│   │   │   │   ├── BasicLineChart.tsx
│   │   │   │   └── types.ts
│   │   │   ├── DataChoiceComponent.tsx
│   │   │   ├── DataPointComponent.tsx
│   │   │   └── ScatterPlot
│   │   │       ├── ScatterPlot.scss
│   │   │       ├── ScatterPlot.tsx
│   │   │       └── types.ts
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   └── types
│   │       ├── DataArray.ts
│   │       ├── DataPoint.ts
│   │       └── Margins.ts
│   └── tsconfig.json
└── requirements.txt
```

## Requirements
Write here all intructions to build the environment and run your code.\
**NOTE:** If we cannot run your code following these requirements we will not be able to evaluate it.

## How to Run
Write here **DETAILED** intructions on how to run your code.\
**NOTE:** If we cannot run your code following these instructions we will not be able to evaluate it.

cd backend-project
uvicorn app:app --reload

cd ../react-frontend
npm start

-> then in the web app: Choose a csv file from the folder example-data. They are all the same dataset, only the variable names are changed such that you can see if it was actually loaded. After its loaded, you can click on the variables on the left to show a histogram in the middle.     
            



## Milestones
Document here the major milestones of your code and future planned steps.\

- [x] Week 21.04.2022 
  - [x] Running Visualisation of dataset
  - [x] posibility to upload dataset
  - [x] put the tabs in place for the pages "group" and "impute" (fancy react stuff) & define the general structure
  - [x] workaround for bug in uvicorn/fastapi for uploading files

- [ ] Week 05.05.2022
  - [ ] Fill the group page with some content

- [ ] At some point  
  - [ ] choose groups of features automatically or manually
  - [ ] add different imputation algorithms and display them on the imputation page

Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.  

## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.

Tags:
- Week 1: [Week 1 Tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/tags/stable-readme)
- Week 2: ..
- Week 3: ..
- ...


import pandas as pd
def get_SR(datadf):
    """
    calcualtes min and max on 60 day time frame and returns two lists containing such values
    @param datadf:
    @return: returns max and min in the form of lists like so: max, min = get_SR(dataframe)
    """
    tempdf = datadf.copy()
    tempdf = tempdf[-61:-1]
    minarray = []
    maxarray = []
    supportindex = tempdf.reset_index()['Low'].idxmin()
    resistanceindex = tempdf.reset_index()['High'].idxmax()
    for i in range(0, 4):
        if (len(tempdf[supportindex + 1:]) > 1):
            supportindex = tempdf.reset_index()[supportindex + 1:]['Low'].idxmin()
            minarray.append(tempdf.iloc[supportindex]["Low"])
        if (len(tempdf[:resistanceindex]) > 1):
            resistanceindex = tempdf.reset_index()[:resistanceindex]['High'].idxmax()
            maxarray.append(tempdf.iloc[resistanceindex]["High"])

    return maxarray,minarray

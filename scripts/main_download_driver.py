import multiprocessing
from download_appendrsi import download_n_save
import time
import os

if not os.path.exists('data'):
    os.makedirs('data')

liststocks = [
'A','AAP','AAPL','ABBV','ABC','ABMD','ABT','ACN','ADBE','ADI','ADM','ADP','ADSK','AEE','AEP','AES','AIG','AIZ','AJG','AKAM','ALB','ALGN','ALK','ALL','ALLE','ALXN','AMAT','AMCR','AMD','AME','AMGN','AMP','AMT','AMZN','ANET','ANSS','ANTM','AON','AOS','APA','APD','APH','APTV','ARE','ATO','ATVI','AVB','AVGO','AVY','AWK','AXP','AZO','BA','BAC','BAX','BBY','BDX','BIIB','BIO','BK','BKNG','BKR','BLK','BLL','BMY','BR','BSX','BWA','BXP','C','CAG','CAH','CARR','CAT','CB','CBOE','CBRE','CCI','CDNS','CDW','CE','CERN','CF','CFG','CHD','CHTR','CI','CL','CLX','CMCSA','CME','CMG','CMI','CMS','CNC','CNP','COF','COG','COO','COP','COST','CPB','CPRT','CRM','CSCO','CSX','CTAS','CTLT','CTSH','CTVA','CTXS','CVS','CVX','D','DAL','DD','DE','DFS','DG','DGX','DHI','DHR','DIS','DISCA','DISH','DLR','DLTR','DOV','DOW','DPZ','DRE','DRI','DTE','DUK','DVA','DVN','DXC','DXCM','EA','EBAY','ECL','EFX','EIX','EL','EMN','EMR','ENPH','EOG','EQIX','EQR','ES','ESS','ETN','ETR','ETSY','EVRG','EW','EXC','EXPE','EXR','F','FANG','FAST','FB','FBHS','FCX','FDX','FE','FFIV','FIS','FISV','FITB','FLS','FLT','FMC','FOXA','FRC','FTI','FTNT','FTV','GD','GE','GILD','GIS','GL','GLW','GM','GOOG','GOOGL','GPC','GPN','GPS','GRMN','GS','GWW','HAL','HAS','HBAN','HBI','HCA','HD','HES','HFC','HIG','HII','HLT','HOLX','HON','HPE','HPQ','HSIC','HST','HSY','HUM','HWM','IBM','ICE','IDXX','IEX','IFF','ILMN','INCY','INFO','INTC','INTU','IP','IPG','IPGP','IQV','IR','IRM','ISRG','IT','ITW','IVZ','J','JBHT','JCI','JKHY','JNJ','JNPR','JPM','K','KEY','KEYS','KHC','KIM','KLAC','KMB','KMI','KMX','KO','KR','KSU','LB','LDOS','LEG','LEN','LH','LHX','LIN','LKQ','LLY','LMT','LNC','LNT','LOW','LRCX','LUV','LVS','LW','LYB','LYV','MA','MAA','MAR','MAS','MCD','MCHP','MCK','MCO','MDLZ','MDT','MET','MGM','MHK','MKC','MKTX','MLM','MMC','MNST','MO','MOS','MPC','MRK','MRO','MS','MSCI','MSFT','MSI','MTB','MU','MXIM','NCLH','NDAQ','NEE','NEM','NFLX','NI','NKE','NLOK','NLSN','NOC','NOV','NOW','NRG','NSC','NTAP','NUE','NVDA','NVR','NWL','NWSA','O','ODFL','OKE','OMC','ORCL','ORLY','OTIS','PAYC','PAYX','PBCT','PCAR','PEAK','PEG','PEP','PFE','PFG','PG','PGR','PH','PHM','PKG','PKI','PLD','PM','PNC','PNR','PNW','POOL','PPG','PPL','PRGO','PRU','PSA','PSX','PVH','PWR','PXD','PYPL','QCOM','QRVO','RCL','RE','REG','REGN','RF','RHI','RJF','RL','RMD','ROK','ROL','ROP','ROST','RSG','RTX','SBAC','SBUX','SCHW','SEE','SHW','SIVB','SLB','SLG','SNA','SNPS','SO','SPG','SPGI','SRE','STE','STT','STX','STZ','SWK','SWKS','SYF','SYK','SYY','T','TAP','TDG','TDY','TEL','TER','TFC','TFX','TGT','TJX','TMO','TMUS','TPR','TRMB','TROW','TRV','TSCO','TSLA','TSN','TT','TTWO','TWTR','TXN','TXT','TYL','UAA','UAL','UDR','UHS','ULTA','UNH','UNP','UPS','URI','USB','V','VFC','VLO','VMC','VNO','VNT','VRSK','VRSN','VRTX','VTRS','VZ','WAB','WDC','WELL','WFC','WHR','WLTW','WM','WMB','WMT','WRB','WRK','WST','WU','WY','WYNN','XEL','XLNX','XOM','XRAY','YUM','ZBH','ZBRA','ZION','ZTS',]

jobs = []
numberofcall = 0
for i in range(0,len(liststocks)):
    time.sleep(0.9)
    p = multiprocessing.Process(target=download_n_save, args=(liststocks[i],))
    numberofcall +=1
    jobs.append(p)
    p.start()
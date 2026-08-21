# CarTrend Analytics

**"Explore. Compare. Understand the Automobile Market."**

A comprehensive, modern, and fully functional web application for analyzing automobile market data using data science and interactive visualization techniques. This project demonstrates how data cleaning, statistical analysis, and visualization can transform raw automotive data into meaningful market insights.

![CarTrend Analytics](https://img.shields.io/badge/version-1.0-blue.svg)
![Data Science](https://img.shields.io/badge/purpose-Data%20Science-green.svg)
![Visualization](https://img.shields.io/badge/visualization-Chart.js-orange.svg)

---

## 🚀 Project Overview

CarTrend Analytics is a professional-grade automotive market analytics dashboard designed for college-level Data Science mini projects. The application provides comprehensive analysis of car brands, prices, manufacturing years, fuel types, mileage, engine capacity, horsepower, transmission types, and market trends.

### Key Features

- **Interactive Dashboard**: Real-time KPI cards with animated statistics
- **Advanced Filtering**: Multi-parameter filtering system for data exploration
- **Brand Intelligence**: Detailed analysis of individual car manufacturers
- **Brand Comparison**: Side-by-side comparison of 2-4 car brands
- **Price Analysis**: Comprehensive pricing patterns and distribution analysis
- **Fuel Trends**: Analysis of fuel type preferences and market shifts
- **EV Analytics**: Dedicated electric vehicle growth and trend analysis
- **Performance Analytics**: Engine capacity, horsepower, and performance correlations
- **Body Type Analysis**: Vehicle style popularity and characteristics
- **Year-wise Trends**: Timeline analysis of market evolution
- **Car Explorer**: Interactive data table with search, sort, and pagination
- **AI-Style Insights**: Automated insights generated from dataset statistics
- **Top Performers**: Rankings of most expensive, powerful, and efficient vehicles
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **CSV Export**: Download filtered data for further analysis

---

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic structure and layout
- **CSS3**: Modern styling with CSS variables for theming
- **JavaScript (ES6+)**: Core functionality and data processing
- **Bootstrap 5**: Responsive UI framework
- **Bootstrap Icons**: Professional icon set

### Data Visualization
- **Chart.js**: Interactive charts and graphs
- **Custom Chart Implementations**: Scatter plots, line charts, bar charts, doughnut charts

### Data Handling
- **CSV Format**: Raw data storage
- **Client-side Processing**: No backend required
- **Parsers**: Custom CSV parsing and data transformation

---

## 📊 Dataset Description

The application uses a comprehensive automobile dataset with the following structure:

### Data Fields

| Field | Type | Description |
|-------|------|-------------|
| Brand | String | Car manufacturer (e.g., BMW, Toyota, Tata) |
| Model | String | Car model name |
| Year | Integer | Manufacturing year |
| Price | Float | Vehicle price in INR (₹) |
| Fuel_Type | String | Petrol, Diesel, Electric, Hybrid, CNG |
| Transmission | String | Manual, Automatic, AMT, CVT, DCT |
| Mileage | Float | Fuel efficiency in km/l |
| Engine_CC | Float | Engine capacity in cubic centimeters |
| Power_BHP | Float | Horsepower in brake horsepower |
| Torque_Nm | Float | Torque in Newton-meters |
| Body_Type | String | Hatchback, Sedan, SUV, Coupe, Convertible, MPV, Pickup, Wagon |
| Seats | Integer | Number of seats |
| Drive_Type | String | FWD, RWD, AWD, 4WD |
| Owner_Type | String | First, Second, etc. |

### Sample Dataset

The project includes a sample dataset with **185+ car records** across **50+ brands** including:

**Indian Brands**: Tata, Mahindra, Maruti Suzuki, Force Motors  
**Japanese Brands**: Toyota, Honda, Nissan, Suzuki, Mitsubishi, Mazda, Subaru, Lexus, Infiniti, Acura  
**German Brands**: BMW, Mercedes-Benz, Audi, Porsche, Volkswagen, Opel, Mini  
**American Brands**: Ford, Chevrolet, Jeep, Tesla, Dodge, Cadillac, Chrysler, Lincoln, GMC  
**Korean Brands**: Hyundai, Kia, Genesis, SsangYong  
**European Brands**: Volvo, Jaguar, Land Rover, Renault, Peugeot, Fiat, Skoda, Citroën  
**Luxury Brands**: Ferrari, Lamborghini, Maserati, Bentley, Rolls-Royce, Aston Martin

---

## 📁 Project Structure

```
CarTrend-Analytics/
│
├── index.html              # Main HTML structure
│
├── css/
│   └── style.css          # Professional styling with dark/light mode
│
├── js/
│   ├── script.js          # Core functionality, data loading, statistics
│   ├── charts.js          # Chart.js integration and all visualizations
│   ├── filters.js         # Filter system and car explorer table
│   └── insights.js        # AI-style insights and top performers
│
├── data/
│   └── cars.csv           # Sample automobile dataset
│
├── assets/
│   └── images/            # Image assets (if needed)
│
└── README.md              # This file
```

---

## 🚀 How to Run

### Method 1: Direct Browser Opening
1. Navigate to the project directory
2. Open `index.html` in any modern web browser
3. The application will load with the sample dataset

### Method 2: Local Server (Recommended)
Using Python:
```bash
cd "car trend analysis"
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

Using Node.js:
```bash
cd "car trend analysis"
npx http-server
```

### Method 3: VS Code Live Server
1. Install Live Server extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Method 4: Replit
1. Upload all files to Replit
2. The project will run automatically
3. Use the Replit preview window

---

## 🔄 How to Replace the Dataset

To use your own automobile dataset:

1. **Format your CSV file** with the same column structure:
   ```csv
   Brand,Model,Year,Price,Fuel_Type,Transmission,Mileage,Engine_CC,Power_BHP,Torque_Nm,Body_Type,Seats,Drive_Type,Owner_Type
   ```

2. **Replace the sample data**:
   - Open `data/cars.csv`
   - Replace the content with your dataset
   - Save the file

3. **Refresh the application** - The new data will load automatically

### Data Requirements

- **File Format**: CSV (Comma Separated Values)
- **Headers**: Must match the exact field names listed above
- **Data Types**: Ensure numeric fields contain valid numbers
- **Missing Values**: Use 0 for missing numeric values

---

## 📈 How the Analysis Works

### Data Processing Pipeline

1. **Data Loading**: CSV file is parsed and converted to JavaScript objects
2. **Data Cleaning**: Invalid or missing values are handled gracefully
3. **Statistical Calculations**: Real-time computation of averages, counts, and correlations
4. **Visualization**: Charts are dynamically rendered based on current data
5. **User Interaction**: Filters and searches update all visualizations instantly

### Statistical Methods Used

- **Descriptive Statistics**: Mean, median, mode, min, max
- **Correlation Analysis**: Pearson correlation coefficient for relationships
- **Frequency Analysis**: Distribution counts and percentages
- **Comparative Analysis**: Brand-to-brand and category comparisons
- **Trend Analysis**: Time-series analysis of year-wise patterns

### Chart Types

- **Bar Charts**: Brand comparisons, category distributions
- **Line Charts**: Time trends, year-wise patterns
- **Doughnut Charts**: Fuel type, transmission distributions
- **Scatter Plots**: Correlation analysis (price vs power, engine vs power)
- **Horizontal Bar Charts**: Brand rankings with long labels

---

## 🎯 Key Functionalities

### 1. Dashboard KPIs
- Real-time calculation of total cars, brands, averages
- Animated count-up effects on page load
- Updates automatically when filters are applied

### 2. Advanced Filtering System
- **Multi-select filters**: Brand, fuel type, transmission, body type
- **Range filters**: Price, year, mileage
- **Text search**: Search by brand, model, fuel type, body type
- **Instant updates**: All charts and statistics update in real-time
- **Reset functionality**: One-click reset to original dataset

### 3. Brand Intelligence
- Select any brand for detailed analysis
- View brand-specific statistics and distributions
- Analyze fuel type, body type, and transmission preferences
- Compare brand averages against market trends

### 4. Brand Comparison
- Compare 2-4 brands side by side
- View comparison table with key metrics
- Visual comparison charts for price and power
- Identify market positioning and competitive advantages

### 5. Price Analysis
- Price distribution histogram
- Average price by brand, fuel type, body type
- Scatter plots for price vs power and price vs engine
- Identify pricing patterns and premium segments

### 6. Electric Vehicle Analysis
- Dedicated EV statistics and growth tracking
- Year-wise EV adoption trends
- EV brand distribution
- Performance comparison with traditional vehicles

### 7. Performance Analytics
- Engine capacity vs horsepower correlation
- Power vs price relationship analysis
- Mileage comparison by fuel type
- Automated performance insights generation

### 8. Car Explorer
- Interactive data table with all car details
- Sort by any column (price, year, mileage, power)
- Configurable page size (10, 25, 50, 100 items)
- Pagination with smart page navigation
- Export filtered data as CSV

### 9. AI-Style Insights
- Automated generation of key market insights
- Most common/ expensive/ affordable brands
- Popular fuel types and transmissions
- Performance correlations and trends
- Year-wise market evolution

### 10. Dark/Light Mode
- Toggle between professional light and dark themes
- Theme preference saved in localStorage
- All charts adapt to selected theme
- Smooth transitions between themes

---

## 🎨 Design Features

### Professional Dashboard Design
- **Modern UI**: Clean, minimalist interface with card-based layout
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Professional Typography**: Readable fonts with proper hierarchy
- **Color Palette**: Sophisticated color scheme with semantic usage
- **Smooth Animations**: Subtle transitions and hover effects
- **Data-Focused**: Emphasis on data visualization and readability

### Accessibility
- **High Contrast**: WCAG AA compliant color contrasts
- **Responsive Tables**: Horizontal scroll on small screens
- **Mobile Navigation**: Collapsible navbar for mobile devices
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Friendly**: Proper semantic HTML structure

---

## 🧪 Testing and Verification

The application has been tested for:

- ✅ **Data Loading**: CSV parsing and data integrity
- ✅ **KPI Calculations**: Statistical accuracy
- ✅ **Chart Rendering**: All chart types render correctly
- ✅ **Filter Functionality**: Multi-parameter filtering works properly
- ✅ **Search Functionality**: Text search across multiple fields
- ✅ **Sorting**: All sort options work correctly
- ✅ **Pagination**: Page navigation and data display
- ✅ **Brand Analysis**: Dynamic brand-specific analysis
- ✅ **Brand Comparison**: Multi-brand comparison functionality
- ✅ **CSV Export**: Download functionality works correctly
- ✅ **Theme Toggle**: Dark/light mode switching and persistence
- ✅ **Responsive Design**: Layout adapts to all screen sizes
- ✅ **Cross-browser Compatibility**: Works on major browsers

---

## 🎓 College Presentation Features

This project is designed to be presentation-friendly for college mini-projects:

### Clear Data Flow
**Problem → Data → Analysis → Visualization → Insights**

### Explanatory Labels
- Each chart includes clear titles and descriptions
- Statistical terms are explained in context
- Insights include explanations of findings

### Professional Appearance
- Real-world automotive analytics platform look
- Not like a typical college project
- Impressive for demonstrations

### Interactive Demonstrations
- Live filtering during presentations
- Real-time chart updates
- Brand comparison capabilities
- Download functionality for further analysis

---

## 🔧 Future Improvements

Potential enhancements for future versions:

1. **Backend Integration**: Add server-side processing for larger datasets
2. **Database Support**: Connect to SQL/NoSQL databases
3. **Machine Learning**: Add predictive analytics and recommendations
4. **Geographic Analysis**: Add regional/market-specific analysis
5. **Real-time Data**: Live data feeds from automotive APIs
6. **Advanced Charts**: Add more sophisticated visualization types
7. **Export Options**: PDF reports, Excel exports
8. **User Authentication**: Save custom views and preferences
9. **Collaboration Features**: Share insights and analysis
10. **Mobile App**: Native mobile application

---

## 📝 Data Science Concepts Demonstrated

This project demonstrates practical application of:

1. **Data Cleaning**: Handling missing values and data validation
2. **Data Analysis**: Statistical calculations and aggregations
3. **Data Visualization**: Multiple chart types and interactive dashboards
4. **Trend Analysis**: Time-series and pattern recognition
5. **Correlation Analysis**: Relationship identification between variables
6. **Comparative Analysis**: Benchmarking and comparison methodologies
7. **Descriptive Statistics**: Mean, median, mode, distributions
8. **Inferential Statistics**: Pattern recognition and insight generation

---

## 🤝 Contributing

This is a college mini-project, but suggestions and improvements are welcome:

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is created for educational purposes. Feel free to use it as a reference for your own Data Science projects.

---

## 👨‍💻 Author

**Data Science Mini Project**  
College Academic Year 2025-2026

Developed as a demonstration of data science and visualization techniques in understanding real-world automobile market trends.

---

## 🙏 Acknowledgments

- **Chart.js**: For the excellent data visualization library
- **Bootstrap**: For the responsive UI framework
- **Bootstrap Icons**: For the professional icon set
- **Automotive Industry**: For the inspiring dataset

---

## 📞 Support

For questions or issues with this project:

1. Check the **How to Run** section
2. Verify your dataset format matches the requirements
3. Ensure all files are in the correct directory structure
4. Test in different browsers if needed

---

## 🎯 Project Goals Achieved

✅ Complete, modern, professional web application  
✅ Real-world automotive analytics platform appearance  
✅ Comprehensive car brand and model coverage  
✅ Interactive data visualization with Chart.js  
✅ Advanced filtering and search capabilities  
✅ Brand analysis and comparison features  
✅ Price, fuel, performance, and trend analysis  
✅ Electric vehicle dedicated analysis  
✅ Data-driven insights generation  
✅ Top performers rankings  
✅ CSV download functionality  
✅ Dark/light mode with persistence  
✅ Fully responsive design  
✅ College presentation friendly  
✅ No backend required  
✅ Easy dataset replacement  
✅ Clean, documented code  

---

**CarTrend Analytics** - Turning automobile data into meaningful insights.

*© 2026 CarTrend Analytics. All rights reserved.*
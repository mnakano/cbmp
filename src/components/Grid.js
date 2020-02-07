import React, {Fragment, useState} from "react";
import '../styles/index.css';
import { Link } from "gatsby";
import Select from 'react-select';

const customFilterOption = (option, rawInput) => {
    const words = rawInput.split(' ');
    return words.reduce(
        (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
        true,
    );
};

const Grid = ({data}) => {
    const [gridData, setGridData] = useState(data);
    const [sortValue, setSortValue] = useState({'field': 'name', 'order': 'ASC'});

    // show filtered data based on selected keyword
    const handleKeywordsChange = (event) => {
        if (event === null || event.length === 0) {
            setGridData(data);
        } else {
            const keywordArr = event.map((x) => x.value);
            const newGridData = [];
            newGridData.push(data.filter((item) => {
                return keywordArr.some(x => item.node.keywords.includes(x));
            }))
            const sortedGridData = sortItems(newGridData.flat([2]), sortValue);
            setGridData(sortedGridData)
        }
        
    };

    // external sort by value {field, order} so I can call in both handlers
    const sortItems = (data, value) => {
        // creating copy of data
        const newGridData = Array.from(data);
        newGridData.sort(function (a, b) {
            if (value.order === "ASC") {
                return a.node[value.field].localeCompare(b.node[value.field]);
            } else {
                return b.node[value.field].localeCompare(a.node[value.field]);
            }
        });
        return newGridData;
    }
    // show data sorted by option
    const handleSortChange = (event) => {
        // set state so that other handlers can call sort
        setSortValue(event.value);
        
        // sort
        setGridData(sortItems(gridData, event.value));
    };

    // getting keywords
    const nestedKeywords = data.map(x => {
        return x.node.keywords.split(", ")
    })
    const keywords = [].concat(...nestedKeywords).filter(x => x !== "");
    //.flat(2).filter(x => x !== "");
    
    // getting options out of the keywords
    const keywordOptions = keywords.map(x => {return {'value': x, 'label': x}});
    
    // making sorting options
    const sortOptions = [
        {'label': 'Alphabetical - ascending', 'value': {'field': 'name', 'order': 'ASC'}},
        {'label': 'Alphabetical - descending', 'value': {'field': 'name', 'order': 'DESC'}},
        {'label': 'Lab name - ascending', 'value': {'field': 'lab', 'order': 'ASC'}},
        {'label': 'Lab name - descending', 'value': {'field': 'lab', 'order': 'DESC'}},
    ]

    // {'label': 'Alphabetical - ascending', 'value': {'field': 'name', 'order': 'ASC'}},
    //     {'label': 'Alphabetical - descending', 'value': 'name-DESC'},
    //     {'label': 'Lab name - ascending', 'value': 'lab-ASC'},
    //     {'label': 'Lab name - descending', 'value': 'lab-DESC'},

    return (
        <Fragment>
            <div className="select-container">
                <Select
                    isMulti
                    filterOption={customFilterOption}
                    options={keywordOptions}
                    placeholder="Select keywords..."
                    // components={{ Option: CustomOption }}
                    // styles={customStyles}
                    onChange={handleKeywordsChange}
                />
                <Select
                    filterOption={customFilterOption}
                    options={sortOptions}
                    placeholder="Sort by..."
                    // components={{ Option: CustomOption }}
                    // styles={customStyles}
                    onChange={handleSortChange}
                />
            </div>
            <div className="grid-container">
                {gridData.length > 0 &&
                    gridData.map((item,i) => (
                        <div className="grid-item" key={i}>
                            <Link to="/">{item.node.name}</Link>
                            <span className="desc">
                                {item.node.short_desc}
                            </span>
                            <span className="lab-name">
                                [ <Link to="/">{item.node.lab} Lab</Link> ]
                            </span>
                        </div>
                ))}
            </div>
        </Fragment> 
    )
}
 

export default Grid;

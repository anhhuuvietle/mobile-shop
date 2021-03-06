import React, { Component } from 'react';
import './Search.css';
import { Button } from '@material-ui/core';
import ProductItem from '../ProductItem/ProductItem';
import PreviewedItem from '../ProductItem/PreviewedItem/PreviewedItem';
import axios from '../../../constants/axiosInstance';

class Search extends Component {
    state = {
        items: [],
        previewingItem: null,
        currentPage: 0,
        totalPage: 0,
        prodArrange: 1,
        prodFilter: 0
    }
    componentDidMount() {
        const { currentPage, prodArrange, prodFilter } = this.state;
        this.handleGetProducts(currentPage, prodArrange, prodFilter);
        this.handleGetTotalPage(prodFilter);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.keyword !== this.props.match.params.keyword) {
            this.setState({
                currentPage: 0,
                prodArrange: 1,
                prodFilter: 0
            });
            this.handleGetProducts(0, 1, 0);
            this.handleGetTotalPage(0);
        }
    }
    handlePreviewItem = (previewingItem) => e => {
        this.setState({ previewingItem });
    }
    handleGetProducts = (currentPage, prodArrange, prodFilter) => {
        const keyword = this.props.match.params.keyword;
        axios.post('/api/product/search.php', {
            keyword,
            currentPage,
            prodArrange,
            prodFilter
        })
            .then(res => {
                this.setState({ items: res.data });
            })
            .catch(err => {
                console.log(err);
            });
    }
    handleGetTotalPage = (prodFilter) => {
        const keyword = this.props.match.params.keyword;
        axios.post('/api/product/getSearchTotalPage.php', {
            keyword,
            prodFilter
        })
            .then(res => {
                this.setState({ totalPage: res.data });
            })
            .catch(err => {
                console.log(err);
            });
    }
    handleSelectPage = (index) => () => {
        this.setState({ currentPage: index });
        this.handleGetProducts(index, this.state.prodArrange, this.state.prodFilter);
    }
    handleArrangeProducts = (e) => {
        this.setState({ prodArrange: e.target.value, currentPage: 0 });
        this.handleGetProducts(0, e.target.value, this.state.prodFilter);
    }
    handleFilterPrice = (prodFilter) => () => {
        if (this.state.prodFilter === prodFilter) return;
        this.setState({ prodFilter, currentPage: 0 });
        this.handleGetProducts(0, this.state.prodArrange, prodFilter);
        this.handleGetTotalPage(prodFilter);
    }
    render() {
        const { currentPage, totalPage, prodArrange, prodFilter } = this.state;
        const items = this.state.items.map(item => (
            <div className="category-product" key={item.id} >
                <ProductItem
                    item={item}
                    handleTogglePreviewItem={this.handlePreviewItem(item)}
                />
            </div>
        ))
        return (
            <div className="category">
                <div className="category__products">
                    <div className="category-products-arrange">
                        <select value={prodArrange} onChange={this.handleArrangeProducts}>
                            <option value={1}>Mới nhất</option>
                            <option value={2}>Cũ nhất</option>
                            <option value={3}>Giá cao đến thấp</option>
                            <option value={4}>Giá thấp đến cao</option>
                            <option value={5}>Tên A - Z</option>
                            <option value={6}>Tên Z - A</option>
                        </select>
                        <Button variant="contained">Sắp xếp</Button>
                    </div>
                    <div className="category-products-filter">
                        <b>Chọn mức giá:</b>
                        <span className={'filter-price ' + (prodFilter === 0 ? 'filter--active' : '')}
                            onClick={this.handleFilterPrice(0)}>Tất cả</span>
                        <span className={'filter-price ' + (prodFilter === 1 ? 'filter--active' : '')}
                            onClick={this.handleFilterPrice(1)}>Dưới 3 triệu</span>
                        <span className={'filter-price ' + (prodFilter === 2 ? 'filter--active' : '')}
                            onClick={this.handleFilterPrice(2)}>Từ 3 - 6 triệu</span>
                        <span className={'filter-price ' + (prodFilter === 3 ? 'filter--active' : '')}
                            onClick={this.handleFilterPrice(3)}>Từ 6 - 10 triệu</span>
                        <span className={'filter-price ' + (prodFilter === 4 ? 'filter--active' : '')}
                            onClick={this.handleFilterPrice(4)}>Từ 10 - 15 triệu</span>
                        <span className={'filter-price ' + (prodFilter === 5 ? 'filter--active' : '')}
                            onClick={this.handleFilterPrice(5)}>Trên 15 triệu</span>
                    </div>
                    <div className="category-products-grid">
                        {items.length === 0 &&
                            <p style={{textAlign: 'center', width: '100%'}}><em>Không có sản phẩm nào</em></p>}
                        {items}
                    </div>
                </div>
                {
                    this.state.previewingItem !== null &&
                    <PreviewedItem open={this.state.previewingItem} handleClose={this.handlePreviewItem(null)} item={this.state.previewingItem} />
                }
                <div className="category__pagination">
                    <i className="material-icons"
                        onClick={this.handleSelectPage(0)}>first_page</i>
                    <i className="material-icons"
                        onClick={this.handleSelectPage(currentPage < 1 ? currentPage : currentPage - 1)}>chevron_left</i>
                    {[...Array(totalPage)].map((el, index) =>
                        <span key={'page' + index}
                            className={currentPage === index ? 'pagination__active' : ''}
                            onClick={this.handleSelectPage(index)}>
                            {index + 1}
                        </span>
                    )}
                    <i className="material-icons"
                        onClick={this.handleSelectPage(currentPage === totalPage - 1 ? currentPage : currentPage + 1)}>chevron_right</i>
                    <i className="material-icons"
                        onClick={this.handleSelectPage(totalPage - 1)}>last_page</i>
                </div>
            </div>
        );
    }
}

export default Search;
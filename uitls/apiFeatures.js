class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    console.log('key',keyword)
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    let queryCopy = { ...this.queryStr };
    const excludedFields = ["page, limit"];
    excludedFields.map((field) => delete Object(queryCopy)[field]);
    queryCopy = JSON.parse(
      JSON.stringify(queryCopy).replace(
        /\b(lt|lte|gt|gte)\b/g,
        (match) => `$${match}`
      )
    );
    this.query = this.query.find(queryCopy);
    return this;
  }
  pagination(limit) {
    const page = this.queryStr.page * 1 || 1;
    const skip = (page - 1) * limit;
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
  sort() {
    this.query = this.query.sort("-cartAt -_id");
    return this;
  }
}
module.exports = ApiFeature;

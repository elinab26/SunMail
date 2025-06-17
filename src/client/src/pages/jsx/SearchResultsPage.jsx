import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MailContext } from '../../contexts/MailContext';
import Mail from '../../components/jsx/Mail';
import '../css/SearchResultsPage.css'; // Assuming you'll create this CSS file

function SearchResultsPage() {
  const { mails, fetchMails } = useContext(MailContext);
  const [filteredMails, setFilteredMails] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    // Fetch all mails if not already fetched or if context is empty
    if (mails.length === 0) {
      fetchMails();
    }
  }, [mails.length, fetchMails]);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = mails.filter(mail => 
        mail.subject.toLowerCase().includes(lowerCaseQuery) ||
        mail.body.toLowerCase().includes(lowerCaseQuery) ||
        (mail.fromUser && mail.fromUser.name.toLowerCase().includes(lowerCaseQuery)) ||
        (mail.toUser && mail.toUser.name.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredMails(results);
    } else {
      setFilteredMails([]); // Clear results if no query
    }
  }, [searchQuery, mails]);

  return (
    <div className="search-results-container">
      <h2>Search Results for "{searchQuery}"</h2>
      {filteredMails.length > 0 ? (
        <div className="mails-list">
          {filteredMails.map(mail => (
            <Mail key={mail.id} mail={mail} fetchMails={fetchMails} />
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;
